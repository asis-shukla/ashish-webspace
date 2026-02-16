import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { features } from "app/constants";
import { fetchHashnodePosts } from "app/lib/hashnode";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  tags: string;
  image?: string;
};

type BlogPost = {
  metadata: Metadata;
  slug: string;
  content: any; // Can be serialized MDX or HTML string
  isHashnode?: boolean; // Flag to indicate if post is from Hashnode
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match ? match[1] : "";
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim() ? frontMatterBlock.trim().split("\n") : [];
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['\"](.*)['\"]$/, "$1");
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
    : [];
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

async function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let { metadata, content } = readMDXFile(path.join(dir, file));
      let slug = path.basename(file, path.extname(file));

      // serialize content for next-mdx-remote (RSC usage expects a serialized object)
      let mdxSource = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      });

      return {
        metadata,
        slug,
        content: mdxSource,
      };
    })
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // If IN_WEBSITE_BLOGS is false, fetch from Hashnode
  if (!features.IN_WEBSITE_BLOGS) {
    return getHashnodePosts();
  }
  
  // Otherwise use local MDX files
  return getMDXData(path.join(process.cwd(), "content"));
}

async function getHashnodePosts(): Promise<BlogPost[]> {
  const posts = await fetchHashnodePosts();
  return posts.map((post) => ({
    metadata: {
      title: post.title,
      publishedAt: post.publishedAt,
      summary: post.brief,
      tags: post.tags.map((tag) => tag.name).join(", "),
      image: post.coverImage?.url,
    },
    slug: post.slug,
    content: post.content, // Store HTML content directly
    isHashnode: true,
  }));
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
