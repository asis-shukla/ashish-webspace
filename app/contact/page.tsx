"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

function Contact() {
  const [state, handleSubmit] = useForm("meoqawvr");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // if (state.succeeded) {
  //   return ;
  // }

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isAnonymous) {
      nameInputRef.current.value = "Anonymous";
      emailInputRef.current.value = "anonymous@mail.com";
    } else {
      nameInputRef.current.value = "";
      emailInputRef.current.value = "";
    }
  }, [isAnonymous]);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight"> Contact Me</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex">
          <input
            id="checkbox"
            type="checkbox"
            name="checkbox"
            className="w-5 h-f"
            onClick={(event) => {
              setIsAnonymous(event.target.checked);
            }}
          />
          <label
            htmlFor="checkbox"
            className={"text-sm font-medium text-gray-600 ml-4"}
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
            readOnly={isAnonymous}
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
            readOnly={isAnonymous}
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
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
          Submit
        </button>
      </form>
      <div className="mt-6 text-lg font-bold">
        {state.succeeded ? (
          <p>We received your message, Thanks! </p>
        ) : (
          <p>There is some error.</p>
        )}
      </div>
    </section>
  );
}

export default Contact;
