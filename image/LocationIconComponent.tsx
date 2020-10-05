import * as React from "react"
import Svg, { Path, Mask, G } from "react-native-svg"

function LocationIconComponent(props) {
  return (
    <Svg width={226} height={226} viewBox="0 0 226 226" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M113 226c62.408 0 113-50.592 113-113S175.408 0 113 0 0 50.592 0 113s50.592 113 113 113z"
        fill="#000000"
      />
      <Mask
        id="prefix__a"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={226}
        height={226}
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M113 226c62.408 0 113-50.592 113-113S175.408 0 113 0 0 50.592 0 113s50.592 113 113 113z"
          fill="#fff"
        />
      </Mask>
      <G mask="url(#prefix__a)" fillRule="evenodd" clipRule="evenodd">
        <Path
          d="M.68 23.167l23.143 16.12L6.515 44.2l62.683-10.812.205-.282.356.185.857-.148-.169.505 24.106 12.497L122.362-38l10.657 3.572-28.42 85.78 17.763 9.212 18.43 50.445 6.979-1.184 61.763 10.853 22.349 49.588 28.959-33.065 8.472 7.224-32.657 37.284 9.316 22.326-7.772 11.287-9.999-23.959-37.933 43.309.124.33 10.699 24.74-7.771 11.287-10-23.96-42.857 48.933-4.43-11.839 42.512-48.536-22.166-49.155-53.946-9.477-10.373 1.761-24.429 14.594.051.117-33.91 19.985 12.404 28.397-11.03 3.438-11.34-25.96-36.124 21.292-6.034-9.482 37.628-22.18-8.008-18.337 17.423-50.801-6.168-3.472-41.169-47.303 9.023-30.766-43.313 7.472-2.039-10.945L-6.13 46.38.68 23.167zm58.371 162.348l24.33-14.535-15.834-22.807-28.171-4.031-15.78 46.009 5.648 12.931 29.807-17.567zm5.047-49.076l8.1-25.935-49.285 8.974 7.18 8.248 9.17 5.159 24.836 3.554zm-49.678-26.72L-5.867 86.411l8.893-30.314 63.142-10.89 24.336 11.776-6.896 18.458-.496.137-2.271 7.271-4.112 11.005.58.3-1.411 4.515-61.478 11.05zm74.16-13.01l4.722-15.117 7.248-19.4 12.527 6.494 8.127 22.243-32.624 5.78zm41.189 17.664l-4.732-12.953-40.154 7.123-9.42 30.155 2.622 3.849 51.684-28.174zm7.172 8.676l-52.526 28.79 10.37 15.221 1.127-.345 6.978-1.184 61.763 10.854 21.021 46.638 37.753-43.102-22.167-49.155-53.946-9.478-10.373 1.761z"
          fill="#fff"
          fillOpacity={0.2}
        />
        <Path
          opacity={0.296}
          d="M132.63 91.097c1.116-3.403 6.676-6.102 12.382-6.011 5.708.092 9.449 2.94 8.333 6.343-1.117 3.403-6.676 6.102-12.384 6.01-5.707-.092-9.448-2.94-8.331-6.342m38.341.36c3.266-9.957-7.015-16.837-22.445-17.085-15.43-.247-30.091 6.235-33.357 16.192-3.431 10.462 18.352 29.563 18.352 29.563s34.019-18.207 37.45-28.67"
          fill="#212121"
        />
        <Path
          d="M123.989 78.564c-1.321-6.697 4.659-12.5 11.56-11.217 3.856.718 6.969 3.737 7.708 7.48 1.321 6.698-4.659 12.5-11.56 11.217-3.856-.717-6.969-3.736-7.708-7.48m36.083-2.257c0-15.36-11.822-25.666-26.448-25.666-14.628 0-26.45 10.306-26.45 25.666 0 13.073 17.357 34.442 23.95 42.086 1.304 1.513 3.694 1.513 4.998 0 6.593-7.644 23.95-29.013 23.95-42.086"
          fill="#fff"
        />
      </G>
    </Svg>
  )
}

export default LocationIconComponent