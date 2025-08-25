export default function Spinner() {
  return (
    <div className='w-full h-[72px] flex justify-center items-center'>
      <div className='w-6 h-6 border-4 border-t-transparent border-primary-400 rounded-full animate-spin' />
    </div>
  );
}
