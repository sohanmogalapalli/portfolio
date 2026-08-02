interface SectionLabelProps {
  comment: string;
  title: string;
}

/**
 * Renders the `// comment` eyebrow + heading pattern used to open every section,
 * echoing the terminal/code aesthetic established in the hero.
 */
export default function SectionLabel({ comment, title }: SectionLabelProps) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="eyebrow mb-3">// {comment}</p>
      <h2 className="section-heading">{title}</h2>
    </div>
  );
}
