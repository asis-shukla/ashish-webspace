"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { Success } from "./success";

function Contact() {
  const [state, handleSubmit] = useForm("meoqawvr");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAnonymous) {
      nameInputRef.current!.value = "Anonymous";
      emailInputRef.current!.value = "anonymous@mail.com";
    } else {
      nameInputRef.current!.value = "";
      emailInputRef.current!.value = "";
    }
  }, [isAnonymous]);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight"> Contact Me</h1>
      {state.succeeded ? (
        Success
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex">
            <input
              id="checkbox"
              type="checkbox"
              name="checkbox"
              className="size-6"
              onClick={(event: any) => {
                setIsAnonymous(event.target.checked);
              }}
            />
            <label
              htmlFor="checkbox"
              className={"text-base font-medium text-gray-600 ml-4"}
            >
              Send as Anonymous
            </label>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-gray-300"
              ref={nameInputRef}
              disabled={isAnonymous}
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-gray-300"
              ref={emailInputRef}
              disabled={isAnonymous}
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className={"block text-sm font-medium text-gray-600"}
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-gray-300"
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}

export default Contact;
