export function JournalBody({ markdown }: { markdown: string }) {
  const blocks = markdown
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
        if (block.startsWith("> ")) return <blockquote key={index}>{block.slice(2)}</blockquote>;
        if (block.startsWith("- "))
          return (
            <ul key={index}>
              {block.split("\n").map((line) => (
                <li key={line}>{line.replace(/^-\s*/, "")}</li>
              ))}
            </ul>
          );
        return <p key={index}>{block}</p>;
      })}
    </>
  );
}
