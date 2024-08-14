import { useState } from "react";

export default function Description({
    description,
    className,
  }: {
    description: string;
    className: string;
  }) {
    const [expanded, setExpanded] = useState(false);
    return (
      <>
        <pre
          title={expanded ? undefined : "Click to expand"}
          className={`${className ? className : ""} ${
            expanded ? "" : "h-40 hover:bg-gray-600"
          } overflow-hidden py-5 px-2 pt-3 cursor-pointer rounded-xl bg-gray-700`}
          onClick={(!expanded && (() => setExpanded(true))) || undefined}
        >
          <p className="mb-2 text-2xl underline">Description:</p>
          {description}
          <br />
          {expanded && (
            <button
              className="px-5 py-2 mt-5 text-lg rounded-lg bg-gray-800 hover:bg-gray-900"
              onClick={() => setExpanded(false)}
            >
              hide
            </button>
          )}
        </pre>
      </>
    );
  }