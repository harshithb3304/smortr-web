/* eslint-disable @next/next/no-img-element */
type education = {
  user: string;
  image: string;
  degree: string;
  description: string;
  startDate: string;
  endDate: string;
  skills: string[];
  school: string;
  postDate: string;
};

export default function Education({ cardData }: { cardData: education }) {
  return (
    <>
      <div
        // ref={previewRef}
        className={`rounded-[18px] relative bg-white shadow-[0_3px_50px_0_rgba(0,0,0,0.1)]`}
        // data-hadler-id={handlerId}
      >
        <div
          className={`h-[35vh] rounded-t-[18px] z-[8] border-[0.06rem] border-black w-full  bg-[#FAFAFA]  overflow-clip`}
          // onClick={() => {}}
        >
          <img
            src={`/bg1.png`}
            alt="preview"
            className="block object-cover h-full z-[12] w-full "
          />
        </div>
        <div className="px-6 pt-2 pb-4">
          <p className="text-left text-[0.9rem] font-semibold text-[#848484]">
            {cardData.degree}
          </p>
          <p className="text-left text-[1rem] ">
            at <span className="font-semibold ">{cardData.school}</span>
          </p>
          <div className="text-[0.8rem] font-[500] text-[#848484]">
            {/* <span>{data.dates.startDate.getFullYear()}</span>- */}
            <span>{new Date().getFullYear()}</span>
            {" - "}
            {/* <span>{data.dates.endDate.getFullYear()}</span> */}
            <span>{new Date().getFullYear()}</span>
          </div>
          <p className="text-left text-[1rem] text-[#848484] py-6">
            {cardData.description}
          </p>

          <div className="flex flex-wrap">
            {cardData.skills.map((name, index) => {
              return (
                <span
                  key={index}
                  className="inline-block  relative group overflow-x-hidden border-[#479F70] leading-3 border-2  bg-white hover:border-2 hover:overflow-x-visible hovertransition-all p-2 text-[0.75rem] font-[500] text-[#479F70] rounded-[6.25rem] mr-2 whitespace-nowrap mt-1"
                >
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}