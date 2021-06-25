import React, { Component } from 'react';

class Splash extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (

      <div id="container">
          <div id="left" class="contentcontainer">

          <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
          <head>
          <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>IRIDIA Swarm Marketplace</title>
          <meta name="generator" content="Org mode" />
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML"></script>
          </head>
          <body>
          <div id="content">
          <div id="outline-container-org7432ca199" class="outline-2">
          <h1 id="org7432ca9"><span class="section-number-2"></span> Quick Setup </h1>
          <div class="outline-text-2" id="text-1">
          <p>
              <ol class="org-ol">
              <li>Install the <a target="_blank"href="https://metamask.io"> Metamask</a> addon for your browser</li>
              <li>Activate your Metamask wallet</li>
              <li>Make sure you are connected to the <i>Rinkeby Test Network</i></li>
              <li>Enter the marketplace by clicking on the button at the top right side of the site</li>
              </ol>
          </p>
          </div>
          </div>
          &nbsp;

          <div id="outline-container-org7432ca9" class="outline-2">
          <h1 id="org7432ca9"><span class="section-number-2"></span> Abstract</h1>
          <div class="outline-text-2" id="text-1">
          <p>
          <b>IRIDIA<sup><a id="fnr.1" class="footref" href="#fn.1">1</a></sup> Swarm Marketplace</b>: a web-based service marketplace
          for swarm robotics whose logic is coded in a smart-contract and
          uploaded in the Ethereum blockchain. In the proposed app, staff from
          IRIDIA advertises the robotics services available at the lab (number
          of robots, duration of service, and price). Then, customers are able
          to purchase these services and pay with their own
          crypto-wallets. Customers can upload a Merkle tree (MT) with the
          list of sequential tasks the robots need to complete. Once the service is
          completed, customers get the cryptographic proof that the robots
          completed all the tasks included in the MT, which allows them to trust
          the system and understand the service was not faked. Finally,
          customers get pictures and video footage of the final work the robots
          conducted. Videos are automatically uploaded by the system to the
          public IRIDIA Youtube playlist<sup><a id="fnr.2" class="footref" href="#fn.2">2</a></sup>.
          </p>
          </div>
          </div>
          &nbsp;
          <div id="outline-container-orgae74a3c" class="outline-2">
          <h1 id="orgae74a3c"><span class="section-number-2"></span> Introduction</h1>
          <div class="outline-text-2" id="text-2">

          <div id="orga2657c9" class="figure">
          <p><img src={window.location.href + "splash/Marketplace.png"} alt="Marketplace.png" width="1000px" /></p>
          <p><span class="figure-number">Figure 1: </span>Information flow for the proposed application where: (1) IRIDIA staff adds services to the smart-contract by using this web interface. (2) Customers can purchase available services (i.e., a certain number of robots, for a time, for a price) by providing a valid MT as input and paying the price listed in cryptocurrency (i.e., Ethers). (3) Then, the smart-contract sends the MT to the robot swarm and the mission starts. (4) When the job is finished, the resultant hashes that prove that the robots did the job requested are sent to the smart-contract and displayed in the results section of the web interface. (5) The smart-contract publishes multimedia material of the job done by the robots in a public site where the customer can retrieve it.</p>
          </div>

          <p>
          Fig. 1 shows the general framework and main components of the IRIDIA Swarm Marketplace: a web-based
          marketplace for swarm robotics services built on blockchain
          technology. Let’s consider an example of how this marketplace could be used. In
          the planning of research activities there are periods of time in which
          IRIDIA’s robot swarm remains idle. When this happens, the IRIDIA staff
          members taking care of the robot swarm will broadcast the robot swarm availability
          through a market-based website. This website acts as the web front end of a smart-contract<sup><a id="fnr.3" class="footref" href="#fn.3">3</a></sup> uploaded to the Ethereum blockchain. In this website, IRIDIA staff can log
          into the platform by using lab-controlled Ethereum accounts and the
          <a target="_blank" href="https://metamask.io"> Metamask</a> interface (a popular Ethereum wallet that allows your browser
          to connect to the Ethereum blockchain). Then, a new service can be
          added where the number of robots available, the amount of time they
          are available for, and the price charged for their use are
          indicated. Once the service is broadcast, potential customers
          interested in using the robot swarm can purchase the service and
          upload a Merkle Tree (MT) with the encoded set of tasks they need to
          robots to complete.
          </p>

          <p>
          After the received MT is validated, the smart-contract implementing
          the swarm marketplace sends the information to the robots so that they
          can start working. Robots complete the set of tasks the same way it
          was described in the real-robot experiments of <a target="_blank"href="https://arxiv.org/abs/1904.09266"><i>Secure and secret
          cooperation in robot swarms</i></a>. In our initial demonstration example, we
          provide customers with robots that have the maze-formation set of
          actions so that, when they upload their MTs, they can choose which
          kind of pattern to create. Once the mission described in the uploaded
          MT is completed by the robots, the complete set of proofs with their
          corresponding (h<sub>a</sub>, h<sub>s</sub>) values is sent to the smart-contract and
          stored there. Finally, customers can make sure their job has been
          completed by the robots since the values that were used as inputs for
          the MT have been discovered by the robots. Finally, multimedia material of the robots performing the mission is uploaded to the
          IRIDIA Youtube playlist and available for the customer.
          </p>
          </div>
          </div>

          &nbsp;
          <div id="outline-container-orgab854da" class="outline-2">
          <h1 id="orgab854da"><span class="section-number-2"></span> Setup</h1>
          <div class="outline-text-2" id="text-3">
          </div>
          <div id="outline-container-org5bc34ad" class="outline-3">
          <h3 id="org5bc34ad"><span class="section-number-3"></span> Metamask</h3>
          <div class="outline-text-3" id="text-3-1">
          <p>
          In order to access the marketplace, first, you will need a wallet
          that can provide you an Ethereum account. <a target="_blank"href="https://metamask.io/">Metamask</a> provides a
          wallet and a gateway to the Ethereum blockchain ecosystem. Please
          make sure that you have this plugin installed in your browser
          before accesing the marketplace.
          </p>
          </div>
          </div>

          <div id="outline-container-org6d8454c" class="outline-3">
          <h3 id="org6d8454c"><span class="section-number-3"></span> Rinkeby test network</h3>
          <div class="outline-text-3" id="text-3-2">
          <p>
          After Metamask is installed, you need to make sure you are connected to the <i>Rinkeby Test Network</i>. This is the network where the smart-contract that
          controls the marketplace is located. A picture showing
          where this option is located can be found below:
          </p>

          <div id="org8e446c2" class="figure" >
          <img src={window.location.href + "splash/Rinkeby.png"} alt="Rinkeby.png" width="500px"/>
          <p><span class="figure-number">Figure 2: </span>Metamask dialog where the Rinkeby Test Network can be selected</p>
          </div>

          </div>
          </div>
          </div>

          &nbsp;
          <div id="outline-container-org49effd1" class="outline-2">
          <h1 id="org49effd1"><span class="section-number-2"></span> Web interface</h1>
          <div class="outline-text-2" id="text-4">
          </div>
          <div id="outline-container-org8ad6ece" class="outline-3">
          <h3 id="org8ad6ece"><span class="section-number-3"></span> Add service</h3>
          <div class="outline-text-3" id="text-4-1">
          <p>
          In case you connect to the marketplace as an IRIDIA staff member,
          you will have control over one of our institutional accounts. Then,
          the app will display the following dialog:
          </p>


          <div id="orga60dffa" class="figure">
          <p><img src={window.location.href + "splash/AddService.png"} alt="AddService.png" width="1000px" />
          </p>
          <p><span class="figure-number">Figure 3: </span>Add Service dialog</p>
          </div>

          <p>
          By using this dialog, you will be able to advertise a swarm service
          to potential customers. As depicted in Fig. 3, first,
          you will add the number of available robots, then the time they
          will be working for that particular service and finally the price
          (in Ethers) you want to charge for the service.
          </p>
          </div>
          </div>

          <div id="outline-container-org167dd84" class="outline-3">
          <div id="outline-container-orga8dbb54" class="outline-4">
          <h3 id="orga8dbb54"><span class="section-number-4"></span> Upload an MT</h3>
          <div class="outline-text-4" id="text-4-2-1">

          <div id="org6b937a8" class="figure">
          <p><img src={window.location.href + "splash/UploadMT.png"} alt="UploadMT.png" width="1000px" />
          </p>
          <p><span class="figure-number">Figure 4: </span>Upload an MT button dialog</p>
          </div>

          <p>
          In case you connect to the marketplace as a customer and there is
          an available service that you can purchase, the interface will
          show you an &ldquo;Upload&rdquo; button. In case you click on this button, the
          system will ask you to upload an MT with the desired encoded set of tasks. This file must be in json format. An example of how to format this file can be found <a target="_blank" href={window.location.href + "examples/maze_bc.json"}>here</a>.
          </p>
          </div>
          </div>

          <div id="outline-container-orge311b6d" class="outline-4">
          <h3 id="orge311b6d"><span class="section-number-4"></span> Payment</h3>
          <div class="outline-text-4" id="text-4-2-2">
          <p>
          Once the input MT is uploaded and validated, you will be able to
          buy the service. Metamask will parse the service&rsquo;s price and will
          create a new transaction with your account as origin and with the
          smart-contract&rsquo;s address as destination. Once the payment is
          completed and the transaction is confirmed, the ownership of the
          service will be transferred to your account. Then,
          robots will start working.
          </p>
          </div>
          </div>

          <div id="outline-container-orgeb23922" class="outline-4">
          <h3 id="orgeb23922"><span class="section-number-4"></span> Results</h3>
          <div class="outline-text-4" id="text-4-2-3">

          <div id="org84042e3" class="figure">
          <p><img src={window.location.href + "splash/ResultsMT.png"} alt="ResultsMT.png" width="1000px" />
          </p>
          <p><span class="figure-number">Figure 5: </span>Results dialog. The original MT is displayed together with the new data (i.e., results) provided by the robots</p>
          </div>

          <p>
          In case the service was completed successfully, robots will have
          all the information to compute the hashes of the MT leaf nodes you
          provided when you purchased the service. In order to confirm that
          the service has been completed successfully, and the work done by
          the robots was not forged or faked, the swarm will publish the
          received MT together with the data (i.e., results) needed to compute its leaves
          (i.e., tasks). In this situation, the marketplace will
          show a &ldquo;Results&rdquo; button where this information is displayed. An
          example of this dialog is depicted in Fig. 5.
          </p>
          </div>
          </div>
          </div>

          <div id="outline-container-orgea7afd0" class="outline-3">
          <h1 id="orgea7afd0"><span class="section-number-3"></span> Multimedia material</h1>
          <div class="outline-text-3" id="text-4-3">
          <p>
          For every completed service a new video is automatically uploaded
          to the IRIDIA&rsquo;s Swarm Marketplace Youtube playlist<sup><a id="fnr.2.100" class="footref" href="#fn.2">2</a></sup> together with a snapshot picture of the swarm when the service is
          completed. This web interface will show an updated playlist of these
          videos with their correspondent IDs.
          </p>

          <p>
          Finally, the customer can use this multimedia material for whatever
          he/she might need. A good example is service number 3. The customer of this service uploaded an MT that
          encoded his Github <a target="_blank" href="https://github.blog/2013-08-14-identicons/">identicon</a>. After the service was completed by the robots and
          the multimedia material was generated, the customer used the
          snapshot picture as <a target="_blank" href="https://github.com/edcafenet/">his Github profile picture</a>.
          </p>
          </div>
          </div>
          </div>

          &nbsp;
          &nbsp;
          <div id="footnotes">
          <h1 class="footnotes">Footnotes: </h1>
          <div id="text-footnotes">

          <div class="footdef"><sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> <div class="footpara"><p class="footpara">
          IRIDIA is the name of the artificial intelligence lab of
          the Université Libre de Bruxelles, where the real-robot
          experiments presented in this app are taking place.
          </p></div></div>

          <div class="footdef"><sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> <div class="footpara"><p class="footpara">
          <a target="_blank"href="https://youtube.com/playlist?list=PLzpeKcW5WQlw-2MeehPr7ouIhpMI_x2N9">https://youtube.com/playlist?list=PLzpeKcW5WQlw-2MeehPr7ouIhpMI_x2N9</a>
          </p></div></div>

          <div class="footdef"><sup><a id="fn.3" class="footnum" href="#fnr.3">3</a></sup> <div class="footpara"><p class="footpara">
          The smart-contract's source code can be found <a target="_blank" href="https://blockchainswarm.eu/contracts/Marketplace.sol">here</a>
          </p></div></div>

          </div>
          </div></div>
          <div id="postamble" class="status">
          </div>
          </body>
          </html>

          </div>
          <div id="right" class="buttoncontainer">
              <button class="btn btn-primary btn-lg" onClick={this.props.turnOffSplash}>
              Enter marketplace
              </button>
          </div>
      </div>
    );
  }
}

export default Splash;
