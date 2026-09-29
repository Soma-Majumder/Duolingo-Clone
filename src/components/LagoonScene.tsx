
export function LagoonScene() {
  return (
    <div className="lagoon-scene" aria-hidden="true">
      <svg className="lagoon-sky" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMin meet" focusable="false">
        <circle cx="1170" cy="145" r="62" fill="#fff4ce" />
        <g fill="#fff" opacity=".8">
          <path d="M110 176c-26-35 6-68 39-53 5-49 80-49 86 0 39-12 65 31 37 53Z" />
          <path d="M1040 294c-22-28 2-54 29-45 12-39 65-34 70 3 30-9 53 22 33 42Z" />
          <path d="M440 90c-15-20 3-42 25-32 9-28 48-27 54 1 26-8 44 15 27 31Z" />
        </g>
      </svg>
      <div className="lagoon-water">
        <svg viewBox="0 0 1440 380" preserveAspectRatio="none" focusable="false">
          <path d="M0 38Q180 0 360 34T720 30T1080 34T1440 25V380H0Z" fill="#9ce2e9" />
          <path d="M0 105Q190 67 380 103T760 101T1140 90T1440 102V380H0Z" fill="#7dd4e1" opacity=".6" />
          <g fill="none" stroke="#d7f7f6" strokeWidth="5" strokeLinecap="round">
            <path d="M58 130h90m-35 70h45m855-75h115m80 165h95M340 300h90m90-75h40" />
          </g>
        </svg>
      </div>
      <div className="lagoon-island">
        <svg viewBox="0 0 600 400" focusable="false">
          <ellipse cx="275" cy="357" rx="305" ry="34" fill="#65becb" opacity=".3" />
          <path d="M-30 292Q140 227 370 264Q572 280 580 319Q569 372 319 379H-30Z" fill="#e8c991" />
          <path d="M-30 278Q154 219 373 252Q579 277 580 315Q536 354 303 350H-30Z" fill="#c5df8a" />
          <path d="M-30 280Q159 237 366 266Q506 282 540 308Q481 332 286 328H-30Z" fill="#acd479" />
          <path d="M47 279 206 64Q221 41 236 67L376 281Z" fill="#83b6a0" />
          <path d="m220 55 16 12 140 214-145-13 20-105Z" fill="#65998c" />
          <path d="m177 107 29-43q15-23 30 3l30 47-28-10-17 13-15-20-18 18Z" fill="#edf7e6" />
          <path d="m279 279 69-119q12-18 25 3l82 128Z" fill="#93bd96" />
          <path d="m362 154 11 9 82 128-96-8Z" fill="#79a582" />
          <g stroke="#8b7854" strokeWidth="10" strokeLinecap="round">
            <path d="M96 301v-55m47 64v-46m262 33v-60m65 77v-43" />
          </g>
          <g fill="#539d70">
            <path d="m96 168-41 85h82Z" /><path d="m96 207-48 70h96Z" />
            <path d="m405 175-40 83h80Z" /><path d="m405 215-46 65h92Z" />
          </g>
          <g fill="#70b779">
            <path d="m143 217-30 57h60Z" /><path d="m143 245-35 47h70Z" />
            <path d="m470 232-29 47h58Z" /><path d="m470 257-35 43h70Z" />
          </g>
          <g fill="#f6ebc4"><ellipse cx="342" cy="322" rx="11" ry="5" /><ellipse cx="363" cy="327" rx="7" ry="4" /></g>
          <g fill="none" stroke="#80b866" strokeWidth="4" strokeLinecap="round">
            <path d="m246 315-5-12m5 12 8-10m266 5-4-11m4 11 7-7" />
          </g>
        </svg>
      </div>
    </div>
  );
}
