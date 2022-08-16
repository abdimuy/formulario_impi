import * as React from 'react';
import styles from './Formulario.module.scss';
import { IFormularioProps } from './IFormularioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Spinner from './spinner';
import { spfi, SPFx } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import '@pnp/sp/items'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import toast, { Toaster } from 'react-hot-toast';
// class Formulario1 extends React.Component<IFormularioProps, {}> {
//   public render(): React.ReactElement<IFormularioProps> {
//     const {
//       description,
//       isDarkTheme,
//       environmentMessage,
//       hasTeamsContext,
//       userDisplayName
//     } = this.props;
    
//     return (
//       <section className={`${styles.formulario} ${hasTeamsContext ? styles.teams : ''}`}>
//         <div className={styles.welcome}>
//           <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
//           <h2>Well done, {escape(userDisplayName)}!</h2>
//           <div>{environmentMessage}</div>
//           <div>Web part property value: <strong>{escape(description)}</strong></div>
//         </div>
//         <div>
//           <h3>Welcome to SharePoint Framework!</h3>
//           <p>
//             The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
//           </p>
//           <h4>Learn more about SPFx development:</h4>
//           <ul className={styles.links}>
//             <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
//             <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
//           </ul>
//         </div>
//       </section>
//     );
//   }
// }

const initialState = {
  titulo: '',
  contacto: '',
  correo: '',
  telOficina: '',
  extension: '',
  telCelular: '',
}

const ListItemWebPartContext = React.createContext<WebPartContext>(null)

const Formulario : React.FC<IFormularioProps> = (props) => {
  
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState(initialState)

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>):void => {
    const {currentTarget: {value, name}} = e
    setFormData({
      ...formData,
      [name]: value
    })
    console.log(formData)
  }
  // const notify = () => toast.success('Here is your toast.');

  const handleGetData = async() => {
    try {
      // const getlist:SPHttpClientResponse = await props.context.spHttpClient.get(`${props.context.pageContext.web.absoluteUrl}/_api/list/getbyid()`, SPHttpClient.configurations.v1)
      const sp = spfi().using(SPFx(props.context))
      const list = sp.web.lists
      const data = await list.getByTitle('FormularioTest').items()
      // const data = await list.select("FormularioTest")()
      // console.log(data)
      // return 
    } catch(err) {
      console.log(err)
    }
  }
  
  const handleSubmit = async() => {
    try {
      setLoading(true)
      const sp = spfi().using(SPFx(props.context))
      const list = sp.web.lists
      const data = {
        Title: formData.titulo,
        Contacto: formData.contacto,
        Correo: formData.correo,
        TelefonoOficina: formData.telOficina,
        Extension: formData.extension,
        TelefonoCelular: formData.telCelular
      }
      const response = await list.getByTitle('FormularioTest').items.add({
        ...data
      })
      setFormData(initialState)
      toast.success('La información se ha enviado', {
        duration: 4000,
        // icon: '✅'
      })
      console.log(response)
    } catch(err) {
      console.log(err)
      toast.success('Error al enviar la información')
    }
    setLoading(false)
  }

  React.useEffect(() => {
    // handleGetData().catch(err => console.log(err))<
  }, [])
  // return <Spinner />
  
  return (
      <section className={styles.component__container}>
        {loading ? <Spinner />
        :
        <div className={styles.form__container}>
          <h2>Datos de contacto</h2>
          <div className={styles.form__row}>
            <label>Título</label>
            <input onChange={handleInputChange} type='text' name='titulo' value={formData.titulo}/>
          </div>
          <div className={styles.form__row}>
            <label>Contacto</label>
            <input onChange={handleInputChange} type='text' name='contacto' value={formData.contacto} />
          </div>
          <div className={styles.form__row}>
            <label>Correo</label>
            <input onChange={handleInputChange} type='email' name='correo' value={formData.correo}/>
          </div>
          <div className={styles.form__row}>
            <label>Tel. Oficina</label>
            <input onChange={handleInputChange} type='telefono' name='telOficina' value={formData.telOficina} />
          </div>
          <div className={styles.form__row}>
            <label>Extensión</label>
            <input onChange={handleInputChange} type='number' name='extension' value={formData.extension}/>
          </div>
          <div className={styles.form__row}>
            <label>Tel. Celular</label>
            <input onChange={handleInputChange} type='telefono' name='telCelular' value={formData.telCelular}/>
          </div>
          <button className={styles.form__send} onClick={() => handleSubmit()}>Enviar</button>
        </div>

       }
       <Toaster/>
      </section>
    
  );
}

export default Formulario;