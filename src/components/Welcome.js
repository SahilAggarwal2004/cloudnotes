import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bg from '../media/bg.webp'
import logo from '../media/logo.webp'

export default function Welcome() {
  const redirect = useNavigate();
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    localStorage.getItem('token') ? redirect('/dashboard') : setWelcome(true)
    return () => {
      setWelcome(false)
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`flex container fixed inset-0 normal:text-white normal:text-opacity-90 justify-center min-w-full ${welcome ? '' : 'hidden'}`}>
      <div className="container col-span-3 flex flex-col justify-evenly items-center min-w-[30vw] h-full normal:bg-purple-600">
        <div className='flex flex-col items-center'>
          <img src={logo} alt="CloudNotes" id="logo" className='w-16 h-16 normal:invert-90' />
          <h1 className='text-xl font-bold normal:font-semibold'>CloudNotes - Notes on Cloud</h1>
        </div>
        <div className='px-7 text-justify'>CloudNotes is an online platform to save all your notes at one place on the cloud. It is a platform where your notes are totally encrypted and secured so that no one except you can access your notes.</div>
        <p className='hidden'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero saepe similique ex eligendi reiciendis praesentium cum inventore. Rerum, quos vel accusamus voluptate aliquam nam id nesciunt totam quisquam odio corporis quis, vero reprehenderit omnis animi deleniti nisi dolor. Reiciendis asperiores ratione incidunt voluptates dolore ipsam harum tempora maxime laboriosam, ab odio vitae obcaecati numquam quas labore amet perspiciatis vel veniam recusandae temporibus. Dicta, similique fugiat. Nobis ea nulla, hic autem harum animi cumque quas. Ipsa blanditiis, veritatis ab possimus inventore temporibus debitis officiis ratione ut sequi iusto placeat eum obcaecati accusamus tempore nobis at quae, excepturi dignissimos voluptates! Deserunt, reiciendis rerum nulla, totam eum iure inventore ratione illum, delectus numquam neque aut quis cupiditate fuga dignissimos aliquid ipsa repellendus molestiae perspiciatis voluptatibus aliquam! Id iusto tempora quas deleniti. Asperiores nulla voluptates architecto, aspernatur sunt dolorum provident atque ullam? Maiores eaque blanditiis animi voluptas nisi laudantium dolores nostrum, itaque, id sequi enim excepturi optio ea illo delectus officia corporis aut dolorem porro aliquam sint laborum quod ipsum magni? Iusto impedit incidunt quas. Illum dolorem sapiente, earum nemo libero culpa porro, inventore tempora mollitia doloribus itaque veniam repellendus modi ducimus. Illo repellat itaque tempora laudantium! Sequi quisquam quas ipsa ut optio culpa quo deleniti eveniet voluptate nobis modi hic odio qui ullam a, maxime repellendus in aliquid natus eligendi laborum aspernatur iste non quia! Pariatur maiores nam in, iusto facere quis officia provident ab magnam laudantium, eum atque cumque aut ipsa quasi nostrum enim iste. Molestiae tenetur iure minima, incidunt quam pariatur?</p>
        <Link className="p-1 relative hover:after:scale-100 hover:translate-x-2 after:content-[''] after:h-0.5 after:w-[100%] after:absolute after:scale-0 after:left-0 after:top-[calc(100%)] after:z-10 after:border after:opacity-90 after:border-black normal:after:border-white after:transition-transform after:duration-300 transition-transform duration-300" to="/signup"><strong>Continue to Website</strong> ➤</Link>
      </div>
      <img src={bg} alt=" " className='fixed normal:static h-full object-cover w-full -z-10 normal:z-0 normal:min-w-[70vw]' />
    </div>
  )
}
