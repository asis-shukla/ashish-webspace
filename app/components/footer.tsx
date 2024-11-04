"use client";

import React from "react";
import {
  FaXTwitter,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaFacebook,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { metaData, socialLinks } from "app/config";

const YEAR = new Date().getFullYear();

function SocialLink({ href, icon: Icon, title }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={title}>
      <Icon />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="flex text-xl gap-3.5 float-right transition-opacity duration-300 hover:opacity-90">
      <SocialLink href={socialLinks.twitter} icon={FaXTwitter} title="X" />
      <SocialLink href={socialLinks.github} icon={FaGithub} title={"Github"} />
      <SocialLink
        href={socialLinks.linkedin}
        icon={FaLinkedinIn}
        title={"Linkedin"}
      />
      <SocialLink
        href={socialLinks.instagram}
        icon={FaInstagram}
        title={"Instagram"}
      />
      <SocialLink
        href={socialLinks.facebook}
        icon={FaFacebook}
        title={"Facebook"}
      />
      <SocialLink
        href={socialLinks.email}
        icon={TbMailFilled}
        title={"Email"}
      />
    </div>
  );
}

export default function Footer() {
  return (
    <small className="block lg:mt-24 mt-16 text-[#1C1C1C] dark:text-[#D4D4D4]">
      <time>© {YEAR}</time>{" "}
      <a
        className="no-underline"
        href={socialLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
      >
        {metaData.title}
      </a>
      <style jsx>{`
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
      <SocialLinks />
    </small>
  );
}
