"use client";
import React from "react";
import { useForm, ValidationError } from "@formspree/react";

function Contact() {
  const [state, handleSubmit] = useForm("meoqawvr");
  if (state.succeeded) {
    return <p>Thanks for your message.</p>;
  }
  const labelClassName = "block text-sm font-medium text-gray-600";
  const inputClassName =
    "mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight"> Contact Me</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Your Name
          </label>
          <input id="name" type="text" name="name" className={inputClassName} />
          <ValidationError prefix="Name" field="name" errors={state.errors} />
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className={inputClassName}
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>
        <div>
          <label htmlFor="message" className={labelClassName}>
            Your Message
          </label>
          <textarea id="message" name="message" className={inputClassName} />
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
    </section>
  );
}

export default Contact;
