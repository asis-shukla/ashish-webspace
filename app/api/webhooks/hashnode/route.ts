import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Webhook handler for Hashnode blog post updates
 * Revalidates blog pages when new posts are published or updated
 *
 * Hashnode webhook events:
 * - post.published: New post published
 * - post.updated: Existing post updated
 * - post.deleted: Post deleted
 */

export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get signature from headers
    const signature = request.headers.get("x-hashnode-signature");

    if (!signature) {
      console.warn("Webhook received without signature");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();

    // Verify signature using HMAC SHA256
    const hash = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== hash) {
      console.warn(`Invalid webhook signature. Expected: ${hash}, Got: ${signature}`);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 }
      );
    }

    // Parse and validate body
    const payload = JSON.parse(body);

    if (!payload.data?.post) {
      console.warn("Webhook payload missing post data");
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { event } = payload;
    const { slug, title } = payload.data.post;

    console.log(`Webhook received: ${event} for post "${title}" (slug: ${slug})`);

    // Revalidate blog pages on publish, update, or delete
    if (
      event === "post.published" ||
      event === "post.updated" ||
      event === "post.deleted"
    ) {
      // Revalidate blog listing page
      revalidatePath("/blog");

      // Revalidate the specific post page
      revalidatePath(`/blog/${slug}`);

      // Revalidate feed routes
      revalidatePath("/feed/[format]", "page");

      console.log(
        `✓ Revalidated: /blog, /blog/${slug}, and feed routes`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully revalidated blog pages for post: ${title}`,
        event,
        slug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
