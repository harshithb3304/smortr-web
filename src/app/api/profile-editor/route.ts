import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { redirect } from "next/navigation"

// import { redirect } from 'next/dist/server/api-utils';
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body: { uid: string } = await req.json()

    const uid = body.uid
    // console.log(name);
    // Get the path of the json file
    const docRef = doc(db, "users", uid)
    const document = await getDoc(docRef)
    if (document.exists()) {
      const data = await document.data()
      return NextResponse.json({ ...data })
    } else {
      redirect("/feed")
    }
  } catch (err) {
    console.log(err)
  }
  // console.log(user)
  //   if (user) return NextResponse.json({ ...user })
}
