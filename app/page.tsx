import Image from "next/image";
import { socialLinks } from "./config";

export default function Page() {
  return (
    <section>
      <a href={socialLinks.twitter} target="_blank">
        <Image
          src="/IMG_2461.png"
          alt="Profile photo"
          className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0"
          unoptimized={false}
          width={180}
          height={180}
          priority
        />
      </a>

      <h1 className="mb-8 text-2xl font-medium tracking-tight">About</h1>

      <div className="prose prose-neutral dark:prose-invert">
        <p>Hey there! It’s me, Ashish.</p>
        <p>
          I’m a front-end developer with five years under my belt, crafting web
          applications that (hopefully) make people say, “Wow, that’s smooth!”
          Armed with React, HTML, CSS, JavaScript, and a sprinkle of Redux
          magic, I love blending design and functionality to create seamless
          digital experiences.
        </p>
        <p>
          Beyond the screen, I’m on a mission to make learning more fun and
          accessible—because who says education has to be boring? I’m all about
          using tech and AI to shake up the way we learn, especially here in
          India.
        </p>
        <p>
          When I’m not coding, you’ll find me off exploring. I’m an outdoor
          enthusiast who loves cycling, mountains, beaches, and now, apparently,
          sailing—because why not add “wannabe sailor” to the list? I’m also a
          big fan of comedy movies and music, both of which keep my sanity
          intact.
        </p>
        <p>
          So, if you’re looking to chat, collaborate, or just share your
          favorite cat meme, don’t be shy! Click your favorite social media icon
          at the bottom to stay updated on my latest projects, blogs, and maybe
          a few inspirational quotes...or just cute animal pictures!"
        </p>
        <p>
          Welcome to my portfolio! Here’s where I share my work, my wild ideas,
          and my dream of a more connected world… with a touch of adventure, of
          course.
        </p>
      </div>
    </section>
  );
}
