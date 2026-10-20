import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) {
    return <p className="text-muted-foreground italic">No description provided.</p>;
  }

  // Parse markdown lines into structured elements
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let codeBlock: string[] | null = null;
  let codeLang = '';

  const renderInline = (text: string): React.ReactNode => {
    // Basic inline parser: bold, code, italic
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded bg-muted/80 text-primary-300 font-mono text-xs border border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    // Code block start / end
    if (line.trim().startsWith('```')) {
      if (codeBlock === null) {
        codeBlock = [];
        codeLang = line.trim().replace(/^```/, '').trim();
      } else {
        const fullCode = codeBlock.join('\n');
        elements.push(
          <div key={`code-${index}`} className="my-3 rounded-lg overflow-hidden border border-white/10 bg-slate-950 font-mono text-xs">
            {codeLang && (
              <div className="px-3 py-1 bg-white/5 border-b border-white/10 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                {codeLang}
              </div>
            )}
            <pre className="p-3 text-slate-200 overflow-x-auto whitespace-pre">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        codeBlock = null;
      }
      return;
    }

    if (codeBlock !== null) {
      codeBlock.push(line);
      return;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl font-bold text-white mt-4 mb-2 pb-1 border-b border-white/10">
          {renderInline(line.substring(2))}
        </h1>
      );
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-white mt-3 mb-1.5 pb-1 border-b border-white/10">
          {renderInline(line.substring(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-semibold text-white mt-2.5 mb-1">
          {renderInline(line.substring(4))}
        </h3>
      );
      return;
    }

    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <li key={index} className="ml-4 list-disc text-slate-300 text-sm my-0.5">
          {renderInline(line.trim().substring(2))}
        </li>
      );
      return;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={index} className="text-sm text-slate-300 leading-relaxed my-1">
        {renderInline(line)}
      </p>
    );
  });

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};
