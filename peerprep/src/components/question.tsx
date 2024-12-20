import { Question } from "@/actions/questions";
import { Divider, Stack, Badge, Group, ScrollArea, StackProps, Code, TypographyStylesProvider } from "@mantine/core";
import React from "react";
import { Children } from "react";
import Markdown from 'react-markdown';
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math'

export function CustomMarkdown({ children }: Readonly<{ children?: string }>) {
  return (
    <TypographyStylesProvider>
      <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} children={children} components={{
        pre(props) {
          const code = Children.toArray(props.children).find(n => {
            console.log(n);
            return React.isValidElement(n) && n.type === (<code/>).type;
          });
          if (React.isValidElement(code)) {
            return <Code block {...code.props} />
          }
          return <pre {...props} />
        }
      }} />
    </TypographyStylesProvider>
  )

}

export default function QuestionDisplay({ question, ...stackProps }: { question: Question } & StackProps) {

  const difficultyBadgeColor = (() => {
    switch (question.complexity) {
      case "Easy":
        return "green";
      case "Medium":
        return "yellow";
      case "Hard":
        return "red";
    }
  })()

  const markdown = (
    <CustomMarkdown >{`# ${question.title}\n${question.description}`}</CustomMarkdown>
  )

  return (
    <Stack {...stackProps}>
      <Group wrap="nowrap">
        <Group flex="0 0 auto" h="100%">
          <Badge color={difficultyBadgeColor}>{question.complexity}</Badge>
          <Divider size="sm" orientation="vertical" h="100%" />
        </Group>
        <Group>
          {question.categories.map(c => <Badge key={c.id}>{c.name}</Badge>)}
        </Group>
      </Group>
      <Divider />
      <ScrollArea flex="1 1 auto" h={0} >
        {markdown}
      </ScrollArea>
    </Stack>
  )
}
