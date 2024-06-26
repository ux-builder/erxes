import Link from "next/link"
import { XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen md:items-center justify-center bg-black">
      <ScrollArea className="bg-white md:rounded-lg h-screen md:h-[44rem] md:max-h-[95vh] overflow-hidden">
        <div className="mx-auto flex  w-screen max-w-lg flex-col items-center justify-center px-4 md:px-8 py-5">
          {children}
        </div>
      </ScrollArea>
      <Button
        Component={Link}
        className="absolute right-5 top-5 h-auto rounded-lg md:rounded-full p-1 hover:bg-white/20 hover:text-white bg-neutral-300 md:bg-transparent"
        variant="ghost"
        href="/"
      >
        <XCircleIcon className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}

export default Layout
