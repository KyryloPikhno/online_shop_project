import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"

import { Footer, Header } from "../components"
import { accountActions } from "../redux/slices"

const MainLayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(accountActions.getByAccess())
  }, [dispatch])

  return (
    <div>
      <div className="border w-[100vw]">
        <Header />
      </div>
      <div className="border w-[100vw] h-[90vh]">
        <Outlet />
      </div>
      <div className="border w-[100vw]">
        <Footer />
      </div>
    </div>
  )
}

export { MainLayout }
