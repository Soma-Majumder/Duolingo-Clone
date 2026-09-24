export function ClioMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 448 448"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Clio the jellyfish"
    >
      <g transform="rotate(9 224 224)">
        <g strokeLinecap="round">
          <path stroke="#0789DB" strokeWidth="28">
            <animate
              attributeName="d"
              values="M130 258C130 284 103 291 104 316C105 331 121 335 124 348;
                      M130 258C113 287 78 301 61 279C48 262 51 246 57 229;
                      M130 258C130 284 103 291 104 316C105 331 121 335 124 348"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </path>
          <path stroke="#20B9F4" strokeWidth="31">
            <animate
              attributeName="d"
              values="M175 272C173 300 151 309 158 333C163 351 177 353 172 378;
                      M175 272C174 301 153 333 132 326C113 320 108 298 117 282;
                      M175 272C173 300 151 309 158 333C163 351 177 353 172 378"
              dur="2.6s"
              begin="0.15s"
              repeatCount="indefinite"
            />
          </path>
          <path stroke="#0789DB" strokeWidth="32">
            <animate
              attributeName="d"
              values="M223 278C224 306 206 320 215 342C223 359 237 365 231 391;
                      M223 278C224 306 204 326 217 344C230 362 256 347 247 325;
                      M223 278C224 306 206 320 215 342C223 359 237 365 231 391"
              dur="2.6s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </path>
          <path stroke="#20B9F4" strokeWidth="31">
            <animate
              attributeName="d"
              values="M271 271C274 294 298 304 291 329C286 347 274 351 281 374;
                      M271 271C274 300 294 331 315 323C335 316 339 295 330 280;
                      M271 271C274 294 298 304 291 329C286 347 274 351 281 374"
              dur="2.6s"
              begin="0.15s"
              repeatCount="indefinite"
            />
          </path>
          <path stroke="#0789DB" strokeWidth="28">
            <animate
              attributeName="d"
              values="M314 253C314 277 342 286 341 306C340 320 327 326 329 340;
                      M314 253C335 279 371 298 390 276C403 261 399 242 392 226;
                      M314 253C314 277 342 286 341 306C340 320 327 326 329 340"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </path>
        </g>
        <path
          d="M83 245C86 217 89 164 116 123C140 86 176 65 217 65C265 65 305 88 329 125C351 159 355 209 367 240C374 258 358 279 339 279C326 279 317 273 310 263C304 282 289 294 273 292C261 291 252 284 247 274C240 292 229 301 213 299C198 298 188 288 182 277C174 291 161 297 147 292C135 288 127 278 124 266C115 276 103 278 92 271C83 266 79 256 83 245Z"
          fill="#119FEE"
        />
        <path
          d="M148 119C160 103 179 92 198 91C205 91 207 98 200 103C186 112 175 121 164 129C155 135 142 128 148 119Z"
          fill="#55D3FB"
        />
        <path
          d="M128 180C130 152 147 133 168 133C193 133 211 155 211 184V214C211 235 193 247 168 247C143 247 126 235 126 217Z"
          fill="#57D5FA"
        />
        <path
          d="M235 183C237 155 253 137 275 137C299 137 318 158 318 186V216C318 238 300 251 275 251C250 251 234 239 234 219Z"
          fill="#57D5FA"
        />
        <path
          d="M140 189C140 166 151 149 169 149C188 149 199 166 199 189V214H140Z"
          fill="#FFFFFF"
        />
        <path
          d="M246 191C246 168 258 152 276 152C294 152 306 169 306 191V217H246Z"
          fill="#FFFFFF"
        />
        <path
          d="M164 189C164 175 171 168 181 168C191 168 196 177 196 190V214H164Z"
          fill="#102633"
        />
        <path
          d="M263 191C263 177 270 170 280 170C290 170 296 179 296 192V217H263Z"
          fill="#102633"
        />
        <ellipse cx="170" cy="175" rx="9" ry="10" fill="#FFFFFF" />
        <ellipse cx="269" cy="177" rx="9" ry="10" fill="#FFFFFF" />
        <path
          d="M203 231C202 224 209 220 217 222C224 224 228 224 236 221C244 218 248 224 247 231C245 250 236 260 225 260C213 260 205 249 203 231Z"
          fill="#0866AF"
        />
        <path
          d="M213 250C220 241 233 240 241 247C237 256 231 260 225 260C220 260 216 256 213 250Z"
          fill="#55D3FB"
        />
        <ellipse cx="152" cy="248" rx="13" ry="7" fill="#7DE6FF" />
        <ellipse cx="297" cy="250" rx="13" ry="7" fill="#7DE6FF" />
      </g>
    </svg>
  );
}
