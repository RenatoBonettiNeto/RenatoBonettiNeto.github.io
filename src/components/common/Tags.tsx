export function Tags({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="tags" aria-label="Tecnologias e competências">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
