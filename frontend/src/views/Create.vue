<template lang="pug">
  div#syntax-playground
    b-row#create-footer
      b-col.clickable(xs="6") 
        b-button(:variant="showFormatHelp ? 'danger' : 'info'" @click="showFormatHelp = !showFormatHelp; showPasteBox = false") {{`${ showFormatHelp ? 'hide ' : 'show '} format help`}}
      b-col.clickable(xs="6") 
        b-button(:variant="showPasteBox ? 'danger' : 'info'" @click="processPaste()") {{`${ showPasteBox ? 'process ' : ''} paste`}}
    b-row#create-header
      b-col(xs="8") {{ booklet.title }}
      b-col(xs="4") {{ booklet.author }}
    b-row(v-if="showFormatHelp") 
      b-table(striped hover :items="formattingHelp" head-variant="dark" small bordered)
    b-row(v-if="showPasteBox")
      b-form-textarea#paste-box
    b-form-group(v-for="(scene, index) in booklet.scenes" 
    :description="`highlight-color: ${scene.format.hltColor ? scene.format.hltColor : 'default'} | speed: ${scene.format.speed ? scene.format.speed : 'default'}`"
    )
      label {{ scene.title }}
      b-form-textarea.booklet-create(
      :id="`scene:${index}`"
      :value="scene.text" 
      size="sm" rows="5" 
      :formatter="formatScene"
      :style="{color: scene.format.color, backgroundColor: scene.format.bgColor}"
      )

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
      scene: {
        title: '',
        text: '',
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
        scenes: [{text:'', title:'', format:{}}]
      }
    }
  },
  methods: {
    newScene() {
      this.booklet.scenes.push({});
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
        booklet.scenes.push({text: scene, title:'', format:{}});
      })
      this.booklet = booklet

      this.booklet.scenes = this.booklet.scenes.map( (scene, index) => {
        return this.runPasteCommands(scene, index)
      });

      this.booklet.scenes.forEach( (x, i) => {
        if (x.text === '') {
          this.booklet.scenes.splice(i, 1)
        }
      })

    },
    runPasteCommands(scene, index) {
      let lines = scene.text.split('\n')
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

      scene.text = lines.join('\n').trim()
      return scene
    },
    isCommand(str) {
      return (str.substring(0,2) === '!/' && str.substring(str.length - 1) === '/')
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
          console.log('empty command')
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
          this.booklet.scenes.splice(sceneI + 1, 0, {text:'', title:'', format:{}})
          console.log('id ' + sceneI + 1)
          document.getElementById(`scene:${Number(sceneI + 1)}`).focus()
          break;
        default:
          console.log('dft cmd')
          return false;
      }

      return true;
    },
  computed: {
    sceneStyle() {
      return 'color: white';
      //return 
    },
  }
  }
}
</script>

<style lang="sass">
#create-footer
  .clickable
    padding: 2px
  button
    width: 100%
    color: white
    font-size: .8rem
    padding: 0

#syntax-playground
  table
    text-align: left
    margin-left: 3%
    font-size: .9rem
</style>
