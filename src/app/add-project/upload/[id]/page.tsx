"use client"
import { Controller, useForm } from "react-hook-form"
import Section from "../../Section"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MultiLineInputProject } from "@/components/ui/multilineInput"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { InputProject } from "@/components/ui/input"
import Previews from "../../Dropzone"
import { initialQuestionGenerate } from "@/app/actions/actions"
// import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/app/context/AuthContext"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Select, SelectGroup, SelectItem } from "@/components/ui/select"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import clsx from "clsx"
import { SelectLabel } from "@radix-ui/react-select"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import UploadedSection from "../../UploadedSection"
// import { formatRFC3339 } from "date-fns"

import { MultiSelect, Option } from "react-multi-select-component"
function convertToOptions(props: string[] | undefined): Option[] {
  // console.log(props, "props")
  if (!props) return []
  else {
    let temp: Option[] = props.map((item): Option => {
      return { label: item, value: item }
    })
    return temp
  }
  return []
}
function optionCreator(array: string[]) {
  return array.map((item) => {
    let returnValue: Option = { label: item, value: item }
    return returnValue
  })
}
const design_sector: Option[] = optionCreator([
  "Architecture",
  "Interior Design",
  "Urban Design",
  "Landscape Design",
  "Construction Technology",
  "Infrastructure",
  "Services",
  "Visualization",
  "Concept Design",
  "Art",
])
// const typology: string[] = []
const typology: { label: string; options?: string[] }[] = [
  {
    label: "Residence",
    options: [
      "House",
      "Villa",
      "Apartment",
      "Rooms",
      "Coliving",
      "Social housing",
      "Township",
    ],
  },
  {
    label: "Commercial",
    options: [
      "Retail",
      "Store",
      "Showroom",
      "Shopping center",
      "Market",
      "Exhibit",
      "Station",
      "Bank",
      "Office",
      "Workspace",
      "Institutional",
    ],
  },
  {
    label: "Hospitality",
    options: [
      "Restaurant",
      "Bar",
      "Cafe",
      "Eatery",
      "Pub",
      "Club",
      "Hotel",
      "Hostel",
      "Cabin",
      "Tourism",
    ],
  },
  {
    label: "Sports",
    options: [
      "Gymnasium",
      "Sports field",
      "Recreation",
      "Fitness",
      "Stadium",
      "Indoor hall",
    ],
  },
  {
    label: "Healthcare",
    options: [
      "Hospital",
      "Clinic",
      "Medical facilities",
      "Rehabilitation",
      "Asylum",
      "Spa",
      "Sauna",
      "Veterinary",
      "Shelter",
      "Laboratory",
    ],
  },
  {
    label: "Education",
    options: [
      "School",
      "Kindergarten",
      "Nursery",
      "Library",
      "University",
      "College",
      "Institute",
      "Research center",
      "Coaching center",
      "Dorms",
    ],
  },
  {
    label: "Cultural",
    options: [
      "Theater",
      "Auditorium",
      "Pavilion",
      "Gallery",
      "Exhibition center",
      "Installation",
      "Stall",
      "Forum",
      "Cinema",
      "Concert venue",
      "Hall",
      "Performing arts center",
      "Theme park",
      "Arcade",
      "Gaming",
      "Cultural center",
      "Museum",
      "Heritage",
      "Memorial",
      "Tower",
      "Zoo",
      "Aquarium",
      "Planetarium",
      "Interpretation center",
    ],
  },
  {
    label: "Public",
    options: [
      "Administration buildings",
      "Government buildings",
      "Public service buildings",
      "Courthouse",
      "Town & city hall",
      "Municipal building",
      "Fire station",
      "Police station",
      "Emergency services facility",
      "Headquarters",
      "Training facility",
      "Community center",
      "Monument",
    ],
  },
  {
    label: "Religious",
    options: [
      "Temple",
      "Church",
      "Mosque",
      "Chapel",
      "Monastery",
      "Cathedral",
      "Synagogue",
      "Praying room",
      "Memorial center",
      "Cemetery",
      "Crematorium",
      "Grave",
    ],
  },
  {
    label: "Industrial",
    options: [
      "Factory",
      "Workshop",
      "Industry",
      "Warehouse",
      "Plant",
      "Godown",
      "Brewery",
      "Barn",
      "Storage",
    ],
  },
  {
    label: "Infrastructure",
    options: [
      "Bridges",
      "Transit station",
      "Waste management",
      "Aviation",
      "Telecommunications",
      "Water management",
    ],
  },
  {
    label: "Urbanism",
    options: [
      "Urban planning",
      "Masterplan",
      "Parks",
      "Campus",
      "Public space",
      "Transport corridors",
    ],
  },
  {
    label: "Landscape",
    options: [
      "Greenways",
      "Green belt",
      "Garden",
      "Ground",
      "Layout",
      "Forestry design",
      "Land reclamation",
      "Flood protection",
    ],
  },
  {
    label: "Refurbishment",
    options: ["Renovation", "Extension", "Adaptive reuse", "Restoration"],
  },
]
function convertToValues(props: Option[]): string[] {
  let temp: string[] = props.map((item): string => item.value)
  return temp
}
const scope_role: Option[] = optionCreator([
  "Architectural Designer",
  "Designer",
  "Intern",
  "Engineer",
  "Consultant",
  "Freelancer",
  "Service Provider",
  "Research",
  "Visualization",
  "Student",
  "Contractor",
  "Production",
  "Furniture Designer",
  "Data Analysis",
  "Instructor",
])
const project_type: string[] = ["Hypothetical", "Real-life"]
export default function Upload({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [load, setLoad] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      contentType?: string
      url?: string
      path: string
      user: string
      project: string
    }[]
  >([])

  const [move, setMove] = useState(false)
  const [preventSubmit, setPreventSubmit] = useState(false)
  const { current } = useContext(AuthContext)
  const formSchema = z.object({
    projectName: z.string().min(1),
    description: z.string().optional(),
    files: z.any().array(),
    design_sector: z.string().array().optional(),
    typology: z.string().optional(),
    scope_role: z.string().array().optional(),
    project_type: z.string().optional(),
    // privacy: privacy,
  })
  // form.register
  // const form

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      projectName: "",
      description: "",

      // privacy: "private",
    },
  })
  useEffect(() => {
    if (!current) return
    async function loadInitialValues() {
      try {
        const res = await fetch("/api/add-project/view", {
          method: "POST",
          body: JSON.stringify({ user: current!, uid: params.id }),
        })
        const preData = await res.json()
        // console.log("preData", preData)
        // form.setValue(preData)
        if (preData?.projectName) {
          form.setValue("projectName", preData.projectName)
        }
        if (preData?.description) {
          form.setValue("description", preData.description)
        }
        if (preData?.scope_role) {
          if (typeof preData?.scope_role == "string") {
            form.setValue("scope_role", [preData.scope_role])
          } else form.setValue("scope_role", preData.scope_role)
        }
        if (preData?.design_sector) {
          if (typeof preData?.design_sector == "string") {
            form.setValue("design_sector", [preData.design_sector])
          } else form.setValue("design_sector", preData.design_sector)
        }
        if (preData?.project_type) {
          form.setValue("project_type", preData.project_type)
        }
        if (preData?.typology) {
          form.setValue("typology", preData.typology)
        }

        if (!preData.progress || preData?.progress == 0) {
          // console.log("move", false)
          setMove(false)
        } else {
          // console.log("move", true)
          setMove(true)
        }
        // console.log(preData, "predata")
        if (preData?.status == "submitted") {
          // console.log("preventstatus", true)
          setPreventSubmit(true)
        } else {
          // console.log("preventstatus", false)
          setPreventSubmit(false)
        }
        if (preData?.assets) {
          let uploadFileData: {
            contentType?: string
            url?: string
            project: string
            user: string
            path: string
          }[] = []
          Promise.all(
            preData.assets.map(async (asset: string, index: number) => {
              let assetRef = ref(storage, asset)
              let uploadFile: {
                contentType?: string
                url?: string
                project: string
                user: string
                path: string
              } = {
                path: asset,
                user: current!,
                project: params.id,
              }
              try {
                const metaData = await getMetadata(assetRef)
                uploadFile["contentType"] = metaData.contentType
                if (metaData.contentType?.split("/")[0] == "image") {
                  const url = await getDownloadURL(assetRef)
                  uploadFile["url"] = url
                }
                console.log(index, uploadFile)
                uploadFileData.push(uploadFile)
              } catch (err) {
                console.log(err)
              }
            }),
          )
            .then(() => {
              console.log(uploadFileData, "uploadFileData")
              setUploadedFiles(uploadFileData)
            })
            .catch((err) => {
              console.log(err)
            })

          // setUploadedFiles(preData.assets)
        }
        setLoad(true)
        // if()
        // if(preDa)
      } catch (err) {
        console.log(err)
      }
    }
    loadInitialValues()
  }, [])
  async function uploadContent(values: z.infer<typeof formSchema>) {
    let document: any = {}
    const docRef = doc(db, "users", current!, "projects", params.id)
    let foundCover = false

    try {
      const doc_ = await getDoc(docRef)
      if (doc_.exists() && doc_.data().cover) foundCover = true
      if (values.files.length > 0) {
        values.files.forEach(async (file: File) => {
          const name =
            file.name.split(".").slice(0, -1).join() +
            "-" +
            new Date().getTime() +
            "." +
            file.name.split(".").slice(-1).join()
          const storageRef = ref(
            storage,
            `user-assets/${current}/projects/${params.id}/${name}`,
          )
          const uploadTask = uploadBytesResumable(storageRef, file)
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              // console.log("Upload is " + progress + "% done")
              switch (snapshot.state) {
                case "paused":
                  // console.log("Upload is paused")
                  break
                case "running":
                  // console.log("Upload is running")
                  break
              }
            },
            (error) => {
              // Handle unsuccessful uploads
            },
            async () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              //   const docRef = doc(db, "users", current!)
              //   setImageUrl(downloadURL)
              //   console.log("File available at", downloadURL)
              //   form.setValue("image", [])
              //   return updateDoc(docRef, {
              //     image: downloadURL,
              //     imageName: `user-assets/${current}/${name}`,
              //   })
              // })
              const docRef = doc(db, "users", current!, "projects", params.id)

              await updateDoc(docRef, {
                assets: arrayUnion(
                  `user-assets/${current}/projects/${params.id}/${name}`,
                ),
                files: arrayUnion({
                  privacy: "private",
                  name: `${name}`,
                }),
              })
            },
          )
          if (
            !foundCover &&
            file.type.split("/").splice(0, 1).join("") == "image"
          ) {
            try {
              await updateDoc(docRef, {
                cover: `user-assets/${current}/projects/${params.id}/${name}`,
              })
            } catch (err) {
              console.error(err)
            }
            foundCover = true
          }
        })
      }
      // if (values.description) {
      //   document.description = values.description
      // }
      // if (values.projectName) {
      //   document.projectName = values.projectName
      // }
      document = values
      document.files = undefined
      // console.log(document, "document")
      // , status: "submitted"
      await updateDoc(docRef, { ...document, status: "submitted" })
    } catch (err) {
      console.log(err)
    }
  }
  async function submitHandler(values: z.infer<typeof formSchema>) {
    // if()
    // console.log("values", values)
    await uploadContent(values)
    try {
      const generate_res = initialQuestionGenerate(current!, params.id)
      console.log(generate_res)
    } catch (err) {
      console.log(err)
    }
    // const res = await fetch("/api/add-project/initial-generate-questions", {
    //   method: "POST",
    //   body: JSON.stringify({ userId: current!, projectId: params.id }),
    // })
    setPreventSubmit(true)
    await fetch("/api/send-mail", {
      method: "POST",
      body: JSON.stringify({
        path: `users/${current!}/projects/${params.id}`,
      }),
    })
    if (move) {
      router.push(`/add-project/edit/${params.id}`)
    }
  }
  return (
    // <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <div className="pt-4">
          <div className="flex justify-between items-center  mb-6">
            <h3 className="inline-block text-[1.375rem] font-[500] text-[#151515] tracking-[0.01375rem]">
              {form.watch("projectName", "New Project")}
            </h3>

            <div className="flex">
              <Button
                disabled={!load || preventSubmit}
                onClick={async () => {
                  await form.handleSubmit(uploadContent)()
                }}
                className="inline-block bg-white border border-[#6563FF] text-[#6563FF] rounded-[0.38rem] hover:text-white hover:bg-[#6563FF] hover:border-transparent transition-colors"
              >
                Save
              </Button>
              <Button
                disabled={!load}
                onClick={async () => {
                  await form.handleSubmit(
                    async (values: z.infer<typeof formSchema>) => {
                      try {
                        if (!preventSubmit) await uploadContent(values)
                        const docRef = doc(
                          db,
                          "users",
                          current!,
                          "projects",
                          params.id,
                        )
                        await updateDoc(docRef, {
                          published: true,
                        })
                        router.push("/profile-editor")
                      } catch (err) {
                        console.error(err)
                      }
                    },
                  )()
                }}
                className="ml-2 inline-block bg-[#6563FF] border border-transparent text-white rounded-[0.38rem] hover:text-[#6563FF] hover:border-[#6563FF] hover:bg-white transition-colors"
              >
                Publish
              </Button>
            </div>
          </div>
          <Section active="upload" />

          <div className="mt-8 rounded-[0.88rem] px-8 bg-white py-4 ">
            <FormField
              control={form.control}
              name={`projectName`}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <FormItem>
                      <FormControl>
                        <InputProject
                          {...field}
                          className={` w-[100%]  ${
                            fieldState.error
                              ? "border-[#CC3057]"
                              : " border-[#848484]"
                          }`}
                          required
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-[#CC3057]" />
                    </FormItem>
                  </>
                )
              }}
            />
            <FormField
              control={form.control}
              name={`description`}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <FormItem className="text-left  mt-4 w-[100%]">
                      <FormControl>
                        <MultiLineInputProject
                          placeholder={`Description

                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `}
                          maxLength={600}
                          rows={6}
                          {...field}
                          className={` ${
                            fieldState.error
                              ? "border-[#CC3057]"
                              : "  border-[#848484]"
                          }`}
                          required
                        />
                        {/* <span>{}</span> */}
                      </FormControl>
                      <FormMessage className="text-xs text-[#CC3057]" />
                    </FormItem>
                  </>
                )
              }}
            />
          </div>
        </div>

        <div className="my-4 grid grid-cols-4 gap-x-2">
          {/* <FormField
            control={form.control}
            name={`design_sector`}
            render={({ field, fieldState }) => {
              return (
                <>
                  <FormItem>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-white rounded-[0.88rem] px-4 py-6 text-[0.875rem] font-[500]">
                          <SelectValue placeholder="Design Sector" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-[40vh]">
                          {design_sector.map((option, index) => {
                            return (
                              // <>
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                              // </>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </>
              )
            }}
          /> */}
          <Controller
            control={form.control}
            name="design_sector"
            render={({ field, fieldState }) => {
              return (
                <MultiSelect
                  className="text-black design-sector-view"
                  overrideStrings={{ selectSomeItems: "Design Sector" }}
                  labelledBy="Design Sector"
                  options={design_sector}
                  // value={field.value ? field.value : []}
                  value={convertToOptions(field.value)}
                  // control={form.control}
                  onChange={(props: Option[]) => {
                    return field.onChange(convertToValues(props))
                  }}
                />
              )
            }}
          />

          <FormField
            control={form.control}
            name={`typology`}
            render={({ field, fieldState }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white rounded-[0.88rem] px-4 py-6 text-[0.875rem] font-[500]">
                        <SelectValue placeholder="Typology" />
                      </SelectTrigger>
                      <SelectContent className="overflow-y-auto max-h-[40vh]">
                        {typology.map((group, index) => {
                          return (
                            <SelectGroup key={index}>
                              <SelectLabel className="font-[500] pl-4  border-2 border-gray-100 rounded-sm">
                                {group.label}
                              </SelectLabel>
                              {group.options?.map((item, index) => {
                                return (
                                  <SelectItem key={index} value={item}>
                                    {item}
                                  </SelectItem>
                                )
                              })}
                            </SelectGroup>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )
            }}
          />
          {/* <FormField
            control={form.control}
            name={`scope_role`}
            render={({ field, fieldState }) => {
              return (
                <>
                  <FormItem>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-white rounded-[0.88rem] px-4 py-6 text-[0.875rem] font-[500]">
                          <SelectValue placeholder="Scope/Role" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-[40vh]">
                          {scope_role.map((option, index) => {
                            return (
                              // <>
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                              // </>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </>
              )
            }}
          /> */}
          <Controller
            control={form.control}
            name="scope_role"
            render={({ field, fieldState }) => {
              return (
                <MultiSelect
                  className="scope-role-view text-black scop-role-view"
                  overrideStrings={{ selectSomeItems: "Scope Role" }}
                  labelledBy="Scope Role"
                  options={scope_role}
                  // value={field.value ? field.value : []}
                  value={convertToOptions(field.value)}
                  // control={form.control}
                  onChange={(props: Option[]) => {
                    return field.onChange(convertToValues(props))
                  }}
                />
              )
            }}
          />
          <FormField
            control={form.control}
            name={`project_type`}
            render={({ field, fieldState }) => {
              return (
                <>
                  <FormItem>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-white rounded-[0.88rem] px-4 py-6 text-[0.875rem] font-[500]">
                          <SelectValue placeholder="Project Type" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-[40vh]">
                          {project_type.map((option, index) => {
                            return (
                              // <>
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                              // </>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </>
              )
            }}
          />
        </div>

        {/* <div className="p-4 bg-white rounded-[0.88rem]">
            {uploadedFiles}
          </div> */}
        {/* {uploadedFiles && uploadedFiles.length > 0 && ( */}
        <UploadedSection
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
        {/* )} */}
        <div className="p-4 bg-white rounded-[0.88rem]">
          <h3 className="font-[500] text-[1.25rem]">Upload Content</h3>
          <Previews
            setFiles={form.setValue}
            getValues={form.getValues}
            form={form}
          />
        </div>
        <div className="my-2 relative flex justify-end items-center mt-3">
          <div
            className={clsx(
              "inline-block mr-6 text-[#cc3057] ",
              preventSubmit && !move ? "" : "hidden",
            )}
          >
            We will email you when your content has been processed
          </div>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              {/* <Button variant="outline">Show Dialog</Button> */}
              <Button className="py-2 rounded-[0.38rem] text-red-500  hover:text-white hover:bg-red-500 transition-colors px-8 border border-red-500 bg-white cursor-pointer">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete? Your content will be lost
                  forever.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={deleteStatus}
                  className="bg-black text-white hover:bg-gray-900"
                  onClick={async () => {
                    try {
                      setDeleteStatus(true)
                      const res = await fetch("/api/delete-project", {
                        method: "POST",
                        body: JSON.stringify({
                          projectId: params.id,
                          caller: current!,
                        }),
                      })
                      console.log(res, "delete-project")
                      setDeleteStatus(false)
                      const res_body = await res.json()
                      console.log(res_body, "res_body")
                      if (res.status == 200) {
                        console.log("status")
                        setDeleteStatus(false)
                        router.push("/profile-editor")
                      } else {
                        // const res = await fetch(
                        //   "/api/add-project/delete-project",
                        //   {
                        //     method: "POST",
                        //     body: JSON.stringify({
                        //       projectId: params.id,
                        //       caller: current!,
                        //     }),
                        //   },
                        // )
                      }
                      // console.log(res_body)
                    } catch {
                      setDeleteStatus(false)
                    }
                  }}
                >
                  Continue
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            // onClick={()=>}
            // disabled={ }
            disabled={!load || (preventSubmit && !move)}
            type="submit"
            className="ml-2 py-2 rounded-[0.38rem] text-white hover:border-[#6563FF] hover:bg-white hover:text-[#6563FF] transition-colors px-8 border border-transparent bg-[#6563FF] cursor-pointer"
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
    // </>
  )
}
