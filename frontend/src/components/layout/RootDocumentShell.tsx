import { HeadContent, Scripts } from "@tanstack/react-router";

type RootDocumentShellProps = {
  children: React.ReactNode;
};

export function RootDocumentShell({ children }: RootDocumentShellProps) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
