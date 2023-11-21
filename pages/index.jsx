import { Link } from 'components';

export default Home;

function Home() {
    return (
        <div>
            <h1>Actividad integradora 3. CRUD en Next.js</h1>
            <p>Una aplicación de ejemplo que muestra cómo listar, agregar, editar y eliminar registros de usuarios con Next.js 10 y la biblioteca React Hook Form.</p>
            <p><Link href="/users">&gt;&gt; Administrar Usuarios</Link></p>
        </div>
    );
}
