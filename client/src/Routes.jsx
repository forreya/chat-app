import RegisterAndLogin from "./pages/RegisterAndLogin"
import { useContext } from "react"
import { UserContext } from "./state/userContext"

export default function Routes() {
  const {username, id} = useContext(UserContext)

  if (username) {
    return 'Hello there, ' + username;
  }

  return (
    <RegisterAndLogin />
  )
}