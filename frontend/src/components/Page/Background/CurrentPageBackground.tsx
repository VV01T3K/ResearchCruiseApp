import { useEffect, useState } from "react"
import UserDataManager, {
  IsUserLoggedIn,
} from "../../../ToBeMoved/CommonComponents/UserDataManager"

export const CurrentPageBackground = () => {
  const [pageBackground, _setpageBackground] = useState<string>("default-bg")
  UserDataManager()

  const setPageBackground = () => {
    let image = "default-bg"
    if (!IsUserLoggedIn()) {
      image = "default-bg-stretch"
    } else {
      image = "defualt-bg-logged-in"
    }

    if (pageBackground != image) {
      _setpageBackground(image)
    }
  }

  useEffect(() => {
    setPageBackground()
  })

  return { pageBackgroundImage: pageBackground }
}
