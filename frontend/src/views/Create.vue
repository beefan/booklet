<template lang="pug">
  div#syntax-playground
    b-button-group#create-buttons(size="lg")
      b-button(:variant="showFormatHelp ? 'danger' : 'info'" @click="processFormatHelp()") {{`${ showFormatHelp ? 'hide ' : ''} format help`}}
      b-button(variant="dark" @click="saveBooklet()") save booklet
      b-button(:variant="showPasteBox ? 'danger' : 'info'" @click="processPaste()") {{`${ showPasteBox ? 'process ' : ''} paste`}}
      b-button(:variant="showPdfUpload ? 'danger' : 'info'" @click="processPdfUpload()") {{`${ showPdfUpload ? 'upload file' : 'pdf upload'}`}}
    b-row#create-header
      b-col(xs="8") {{ booklet.title }}
      b-col(xs="4") {{ booklet.author }}
    b-row(v-if="showFormatHelp") 
      b-table(striped hover :items="formattingHelp" head-variant="dark" small bordered)
    b-row(v-if="showPasteBox")
      b-form-textarea#paste-box
    b-row#pdf-upload(v-if="showPdfUpload")
      b-form-file(
      v-model="pdfFile"
      size="sm"
      accept=".pdf"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here...")
    b-form-group(v-for="(scene, index) in booklet.scenes" v-bind:key="index")
      label {{ scene.title }}
      b-form-textarea.booklet-create(
      :id="`scene:${index}`"
      :value="scene.body" 
      size="sm" rows="5" 
      :formatter="formatScene"
      :style="{color: scene.format.color, backgroundColor: scene.format.bgColor}"
      )
      b-row
        b-col#format-desc(sm="8") {{ `highlight-color: ${scene.format.hltColor ? scene.format.hltColor : 'default'} | speed: ${scene.format.speed ? scene.format.speed : 'default'}` }}
        b-col(sm="4")
          b-button(variant="success" @click="loadBooklet(index)") run

</template>

<script>
export default {
  data() {
    return {
      formattingHelp: [{command: '!/ /', action: 'resets formatting'}, 
                      {command: '!/booklet-title=text/', action: 'sets booklet title to text'},
                      {command: '!/color=[valid css color]/', action: 'sets scene color'},
                      {command: '!/hlt-color=[valid css color]/', action: 'sets scene highlight color'},
                      {command: '!/bg-color=[valid css color]/', action: 'sets scene background color'},
                      {command: '!/n/', action: 'creates new scene and focuses'},
                      {command: '!/del/', action: 'deletes focused scene'}],
      showFormatHelp: false,
      showPasteBox: false,
      showPdfUpload: false,
      pdfFile: null,
      scene: {
        title: '',
        body: '',
        format: {
          color: '',
          hltColor: '',
          bgColor: '',
          speed: ''
        }
      },
      booklet: {
        title: '',
        author: '',
        scenes: [{body:'', title:'', format:{}}]
      }
    }
  },
  mounted() {
    if(this.editBooklet.title) {
      this.booklet = this.editBooklet;
    }
  },
  methods: {
    loadBooklet(i) {
      this.$store.commit('setEditBooklet', this.booklet);
      const sceneForReplay = {
                  title: this.booklet.title, 
                  author: this.booklet.author, 
                  scenes: [this.booklet.scenes[this.currScene]] };
      this.$store.commit('setBooklet', sceneForReplay);
      this.$store.commit('navigate', {sent: 0, scene: i});
      this.$router.push('/');
    },
    saveBooklet() {
      if (confirm('Save booklet to profile?')) {
        const sendBooklet = this.booklet;
        sendBooklet.userId = this.user.id;
        this.$store.commit('setEditBooklet', sendBooklet);
        this.$store.dispatch('saveBooklet', sendBooklet);
        alert('Booklet saved')
        this.$router.push('/user');
      }
    },
    newScene() {
      this.booklet.scenes.push({});
    },
    processFormatHelp() {
      this.showFormatHelp = !this.showFormatHelp; 
      this.showPasteBox = false; 
      this.showPdfUpload = false;
    },
    processPdfUpload() {
      if (this.pdfFile) {
        console.log('uploading ' + this.pdfFile.name)
        this.$store.dispatch('savePdfAsBooklet', {pdf: this.pdfFile, userId: this.user.id});
        this.pdfFile = null;
        alert('pdf uploaded')
        this.$router.push('/user');
      }
      this.showPdfUpload = !this.showPdfUpload;
      this.showFormatHelp = false;
      this.showPasteBox = false;
    },
    processPaste() {
      this.showFormatHelp = false;
      const paste = document.getElementById('paste-box');
      if (this.showPasteBox && paste.value) {
        this.setBookletFromPaste(paste.value)
        paste.value = ''
      }
      this.showPasteBox = !this.showPasteBox
    },
    setBookletFromPaste(raw) {
      let booklet = {title: '', author: '', scenes: []}
      let scenes = raw.split('!/n/')
      scenes.forEach( scene => {
        booklet.scenes.push({body: scene, title:'', format:{}});
      })
      this.booklet = booklet

      this.booklet.scenes = this.booklet.scenes.map( (scene, index) => {
        return this.runPasteCommands(scene, index)
      });

      this.booklet.scenes.forEach( (x, i) => {
        if (x.body === '') {
          this.booklet.scenes.splice(i, 1)
        }
      })

    },
    runPasteCommands(scene, index) {
      let lines = scene.body.split('\n')
      lines = lines.map(line => {
        if (this.isCommand(line)) {
          if(this.processCmd(this.getCommand(line), `scene:${index}`)){
            return ''
          } else {/*a command failed; do nothing for now */}
        }
        return line;
      })
      
      lines.forEach((line, index) => {
        if (line === '') {
          lines.splice(index, 1)
        }
      })

      scene.body = lines.join('\n').trim()
      return scene
    },
    isCommand(str) {
      return (str.substring(0,2) === '!/' && str.substring(str.length - 1) === '/' && str.length > 3)
    },
    getCommand(str) {
      return str.substring(2, str.length - 1)
    },
    formatScene(value, e) {
      let n = value.split('\n')
      n = n.map(line => {
        if (this.isCommand(line)) {
          if (this.processCmd(this.getCommand(line), e.target)){
            return '' 
          }
        }
          return line
      })

      return n.join('\n');
    },
    processCmd(cmd, elem) {
      if (!elem) { return false }
      let eqI = cmd.indexOf('=')
      let command = cmd
      let payload = ''
      if (eqI > -1) {
        command = cmd.substring(0, eqI)
        payload = cmd.substring(eqI + 1)
      }
      let sceneI = `${elem.id ? elem.id : elem}`.split(':')[1]
      let thisScene = this.booklet.scenes[sceneI]
      switch(command) {
        case ' ':
          thisScene.format = {
            color: '',
            hltColor: '',
            bgColor: '',
            speed: ''
          };
          break;
        case 'booklet-title':
          this.booklet.title = payload
          break;
        case 'booklet-author':
          this.booklet.author = payload
          break;
        case 'title':
          console.log('title cmd')
          thisScene.title = payload
          break;
        case 'color':
          console.log('color cmd')
          thisScene.format.color = payload
          break;
        case 'hlt-color':
          console.log('hlt cmd')
          thisScene.format.hltColor = payload
          break;
        case 'bg-color':
          console.log('bg cmd')
          thisScene.format.bgColor = payload
          break;
        case 'speed':
          console.log('speed cmd')
          thisScene.format.speed = payload
          break
        case 'del':
          console.log('del')
          if (this.booklet.scenes.length > 1) {
            this.booklet.scenes.splice(sceneI, 1)
          }
          break;
        case 'n':
          console.log('n')
          this.booklet.scenes.splice(sceneI + 1, 0, {body:'', title:'', format:{}})
          new Promise(resolve => setTimeout(resolve, 250)).then(()=> {
            document.getElementById(`scene:${Number(sceneI) + 1}`).focus()
          })          
          break;
        default:
          console.log('dft cmd')
          return false;
      }

      return true;
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    editBooklet() {
      return this.$store.state.editBooklet;
    },
    currScene() {
      return this.$store.state.curr.scene;
    }
  }
}
</script>

<style lang="sass">
#create-buttons
  width: 100%

#syntax-playground
  table
    text-align: left
    margin-left: 3%
    font-size: .9rem
  button
    width: 100%
    color: white
    font-size: .8rem
    padding: 0
#format-desc
  color: grey
  font-size: .7rem
#pdf-upload
  width: 100%
</style>
