export default function Fallback(params: any) {
  return (
    <div
      className='flex items-center justify-center text-left h-screen w-full'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <div className='bp-6 w-min'>
        <h1 className='text-5xl sm:text-9xl font-bold mb-6'>/HGHSKR</h1>
        <p>
          + this is a fallback title, it looks like your device can't handle a
          lot of 3D objects inside the browser really well, try using another
          device if you're really curious 🤖
        </p>
      </div>
    </div>
  )
}
