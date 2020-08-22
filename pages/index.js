import 'isomorphic-fetch';
import Layout from '../components/Layout';
import ChannelGrid from '../components/ChannelGrid';
import Error from 'next/error';

export default class extends React.Component {

    static async getInitialProps({ res }){
        try{
            let req = await fetch('https://api.audioboom.com/channels/recommended');
            //traer los datos de la request en formato json
            //llama a la api busca la variable body y nos trae el atributo channels
            let { body: channels } = await req.json();
            return { channels , statusCode: 200}
        }catch(e){
            res.statusCode = 503;
            return { channels: null, statusCode: 503}
        }
    }

    render(){
        // es lo mismo a  const channels = this.props.channels;
        const {channels , statusCode} = this.props;

        if( statusCode !== 200 ){
            return <Error statusCode={statusCode}/>
        }

        return <Layout title="Podcasts">
            <ChannelGrid channels= {channels } />
        </Layout>
    }
}