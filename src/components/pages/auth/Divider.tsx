const Divider = ({ text }: { text: string }) => {
  return (
    <div className='flex my-[30px] w-full items-center'>
      <hr className='w-full flex-grow' />
      <span className='mx-4 text-[16px] text-[var(--grayscale-700)] text-center whitespace-nowrap cursor-default'>
        {text}
      </span>
      <hr className='w-full flex-grow' />
    </div>
  );
};

export default Divider;
