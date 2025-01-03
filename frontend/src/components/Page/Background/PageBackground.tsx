import { CurrentPageBackground } from "./CurrentPageBackground"

export default function PageBackground() {
  const { pageBackgroundImage } = CurrentPageBackground()
  return <div className={pageBackgroundImage} />
}
