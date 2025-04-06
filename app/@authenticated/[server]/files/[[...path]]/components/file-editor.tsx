import { codeToHtml } from 'shiki';

type FileEditorProps = {
  value: string;
};

export const FileEditor = async ({ value }: FileEditorProps) => {
  const html = await codeToHtml(value, {
    lang: 'javascript',
    theme: 'github-light',
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
