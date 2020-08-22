import Link from 'next/link'
import Layout from '../components/Layout';
import Error from './_error';

export default class extends React.Component {

  constructor(props){
    super(props)
    this.state = { openPodcast: null }
  }

  openPodcast = (event,podcast) => {
      event.preventDefault();
      this.setState({
          openPodcast: podcast
      });
  }
  
  static async getInitialProps({ query , res }) {
    let idChannel = query.id

    try{
      let [reqChannel, reqSeries, reqAudios] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`)
      ])

      if(reqChannel.status >= 404){
        res.statusCode = reqChannel.status;
        return { channel: null, audioClips: null, series:null, statusCode: reqChannel.status }
      }
  
      let dataChannel = await reqChannel.json()
      let channel = dataChannel.body.channel
  
      let dataAudios = await reqAudios.json()
      let audioClips = dataAudios.body.audio_clips
  
      let dataSeries = await reqSeries.json()
      let series = dataSeries.body.channels
  
      return { channel, audioClips, series ,statusCode: 200}
    }catch(e){
      return { channel: null, audioClips: null, series:null, statusCode: 503 }
    }
  }

  render() {
    const { channel, audioClips, series , statusCode} = this.props;
    const {openPodcast} = this.state;

    if( statusCode !== 200 ){
      return <Error statusCode={statusCode}/>
    }

    return <Layout title={channel.title}>

      <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />

      {openPodcast && <div>hay un podcast abierto</div>}
      <h1>{ channel.title }</h1>

      { series.length > 0 &&
        <div>
          <h2>Series</h2>
          <div className="channels">
            { series.map((serie) => (
              <Link href={`/channel?id=${ serie.id }`} prefetch>
                <a className="channel">
                  <img src={ serie.urls.logo_image.original } alt=""/>
                  <h2>{ serie.title }</h2>
                </a>
              </Link>
            ))}
          </div>
        </div>
      }
        
      <h2>Ultimos Podcasts</h2>
      { audioClips.map((clip) => (
        <Link href={`/podcast?id=${clip.id}`} prefetch key={clip.id}>
          <a className='podcast'>
            <h3>{ clip.title }</h3>
            <div className='meta'>
              { Math.ceil(clip.duration / 60) } minutes
            </div>
          </a>
        </Link>
      ))}


      <style jsx>{`
        header {
          color: #fff;
          background: #8756ca;
          padding: 15px;
          text-align: center;
        }

        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
        }

        .channels {
          display: grid;
          grid-gap: 15px;
          padding: 15px;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
        a.channel {
          display: block;
          margin-bottom: 0.5em;
          color: #333;
          text-decoration: none;
        }
        .channel img {
          border-radius: 3px;
          box-shadow: 0px 2px 6px rgba(0,0,0,0.15);
          width: 100%;
        }
        h1 {
          font-weight: 600;
          padding: 15px;
        }
        h2 {
          padding: 5px;
          font-size: 0.9em;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }

        .podcast {
          display: block;
          text-decoration: none;
          color: #333;
          padding: 15px;
          border-bottom: 1px solid rgba(0,0,0,0.2);
          cursor: pointer;
        }
        .podcast:hover {
          color: #000;
        }
        .podcast h3 {
          margin: 0;
        }
        .podcast .meta {
          color: #666;
          margin-top: 0.5em;
          font-size: 0.8em;
        }

      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui;
          background: white;
        }
      `}</style>
    </Layout>
  }
}