interface LayoutProps {
  children: any
  sideContent: any
}

export default function Layout({ children, sideContent }: LayoutProps) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 @4xl:grid-cols-3 @4xl:gap-6">
        <div className="col-span-2">{children}</div>

        <div>{sideContent}</div>
      </div>
    </div>
  )
}
