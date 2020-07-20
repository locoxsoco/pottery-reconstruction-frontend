import PropTypes from 'prop-types'
import React, { Component, useState } from 'react'
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Dimmer,
  Loader,
} from 'semantic-ui-react'
import loadingBackground from '../assets/paragraph.png';
import axios, { post } from 'axios';

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Reconstrucción arqueológica IA'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='El modelo reconstruye la pieza arqueológica ingresada'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item as='a' active>
                  Inicio
                </Menu.Item>
                <Menu.Item as='a'>Sobre el modelo</Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item as='a' active>
            Inicio
          </Menu.Item>
          <Menu.Item as='a'>Sobre el modelo</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile />
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

function Footer(){
  return(
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Sobre' />
              <List link inverted>
                <List.Item as='a'>El modelo</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Tesis' />
              {/*<List link inverted>
                <List.Item as='a'>Banana Pre-Order</List.Item>
                <List.Item as='a'>DNA FAQ</List.Item>
                <List.Item as='a'>How To Access</List.Item>
                <List.Item as='a'>Favorite X-Men</List.Item>
              </List>*/}
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Reconstrucción arqueológica IA
              </Header>
              <p>
              El modelo reconstruye la pieza arqueológica ingresada
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  )
}


function HomepageLayout() {
  const[step,setStep] = useState(1);

  const fileInputRef = React.createRef();

  function fileUpload(e) {
    e.preventDefault();
    let chunks=[];
    let receivedLength = 0;
    const data = new FormData();
    data.append('file', e.target.files[0]);
    data.append('filename', "prueba.png");
    setStep(2);
    fetch('http://localhost:5000/upload', {
      mode: 'cors',
      headers: {
          'Access-Control-Allow-Origin': '*',
      },
      method: 'POST',
      body: data,
    })
    .then(response=>{
      var a = response.body.getReader();
      function readDownloadFile(){
        a.read().then(({done,value})=>{
          if(done){
            console.warn("yei",value);
            let chunksAll = new Uint8Array(receivedLength); // (4.1)
            let position = 0;
            for(let chunk of chunks) {
              chunksAll.set(chunk, position); // (4.2)
              position += chunk.length;
            }
            downloadFile(chunksAll, 'objeto_reconstruido.off');
            chunks=[];
            return;
          }
          console.warn(value);
          chunks.push(value);
          receivedLength += value.length;
          readDownloadFile();
        })
      };
      readDownloadFile();
      setStep(3);
    })
    .catch(response=>{
      setStep(4);
      console.warn("Wrong result",response);
    })
    
  };

  function downloadFile(value,filename) {
    var file = new Blob([value], {type: 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob){ // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    }
    else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0);
    }
  };

  function reloadPage() {
    setStep(1);
  };

  if(step===1){
    return (
      <ResponsiveContainer>
        <Segment vertical>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row style={{paddingBottom: '0em' }}>
              <Grid.Column>
              <Header as='h3'>
                Paso 1/3
              </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
              <Segment placeholder>
                <Header icon>
                  <Icon name='paint brush' />
                  Ingresa el objeto a reconstruir
                </Header>
                <Button class="ui button" onClick={() => fileInputRef.current.click()}>Añadir objeto</Button>
                <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      onChange={fileUpload}
                    />
              </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Footer />
      </ResponsiveContainer>
      )
  }
  else if(step===2){
    return (
      <ResponsiveContainer>
        <Segment vertical>
          <Grid container stackable verticalAlign='middle'>
          <Grid.Row style={{paddingBottom: '0em' }}>
              <Grid.Column>
              <Header as='h3'>
                Paso 2/3
              </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Dimmer active>
                    <Loader size='massive' />
                  </Dimmer>    
                  <Image src={loadingBackground} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Footer />
      </ResponsiveContainer>
      )
  }
  else if(step===3){
    return (
      <ResponsiveContainer>
        <Segment vertical>
          <Grid container stackable verticalAlign='middle'>
          <Grid.Row style={{paddingBottom: '0em' }}>
              <Grid.Column>
              <Header as='h3'>
                Paso 3/3
              </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <Header icon>
                    <Icon name='download' />
                    <div>
                    El objeto está listo
                    </div>
                    <div>
                    Se descargará en breve
                    </div>
                  </Header>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{paddingTop: '0em' }}>
              <Grid.Column>
              <Button class="ui button" onClick={reloadPage}>Reconstruir otro modelo</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Footer />
      </ResponsiveContainer>
      )
  }
  else if(step===4){
    return (
      <ResponsiveContainer>
        <Segment vertical>
          <Grid container stackable verticalAlign='middle'>
          <Grid.Row style={{paddingBottom: '0em' }}>
              <Grid.Column>
              <Header as='h3'>
                Paso 3/3
              </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <Header icon>
                  <Icon name='cloud' />
                    El servidor está haciendo lo mejor que puede. Inténtalo de nuevo por favor.
                  </Header>
                  <Button class="ui button" onClick={reloadPage}>Volver a cargar</Button>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Footer />
      </ResponsiveContainer>
      )
  }
  else{
    return (
      <ResponsiveContainer>
        <Segment vertical>
          <Grid container stackable verticalAlign='middle'>
          <Grid.Row style={{paddingBottom: '0em' }}>
              <Grid.Column>
              <Header as='h3'>
                Paso 3/3
              </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <Header icon>
                  <Icon name='cloud' />
                    El servidor está haciendo lo mejor que puede. Inténtalo de nuevo por favor 2 veces.
                  </Header>
                  <Button class="ui button" onClick={reloadPage}>Volver a cargar</Button>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Footer />
      </ResponsiveContainer>
      )
  }
}

export default HomepageLayout