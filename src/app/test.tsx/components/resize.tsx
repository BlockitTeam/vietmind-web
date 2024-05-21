import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
  
  export default function Example() {
    return (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>One</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Two</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Three</ResizablePanel>
      </ResizablePanelGroup>
    )
  }
  