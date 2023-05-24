import RegisterAndLogin from "./pages/RegisterAndLogin"
import { useContext } from "react"
import { UserContext } from "./state/userContext"
import Chat from "./components/Chat"

export default function Routes() {
  const {username, id} = useContext(UserContext)

  if (username) {
    return <Chat />
  }

  return (
    <RegisterAndLogin />
  )
}