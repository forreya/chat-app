import Register from "./pages/Register"
import { useContext } from "react"
import { UserContext } from "./state/userContext"

export default function Routes() {
  const {username, id} = useContext(UserContext)

  if (username) {
    return 'Logged in!';
  }

  return (
    <Register />
  )
}