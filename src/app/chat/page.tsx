import { cookies } from "next/headers"
import Image from "next/image"

import { accounts, mails } from "./data"
import { Mail } from "./components/mail"

export default function MailPage() {
  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout?.value) : undefined
  // const defaultCollapsed = collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="hidden flex-col md:flex">
        <Mail
          accounts={accounts}
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={false}
          navCollapsedSize={4}
        />
      </div>
    </>
  )
}