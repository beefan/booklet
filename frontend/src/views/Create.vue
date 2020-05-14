<template lang="pug">
  div#syntax-playground
    b-row#create-header
      b-col(xs="8") {{ booklet.title }}
      b-col(xs="4") {{ booklet.author }}
    b-row#create-footer
      b-col.clickable(xs="6") 
        b-button(:variant="showFormatHelp ? 'danger' : 'info'" @click="showFormatHelp = !showFormatHelp") {{`${ showFormatHelp ? 'hide ' : 'show '} format help`}}
      b-col.clickable(xs="6") 
        b-button(:variant="showPasteBox ? 'danger' : 'info'" @click="processPaste()") {{`${ showPasteBox ? 'process ' : ''} paste`}}
    b-row(v-if="showFormatHelp") 
      b-table(striped hover :items="formattingHelp" head-variant="dark" small bordered)
    b-row(v-if="showPasteBox")
      b-form-textarea
    b-form-group(v-for="(scene, index) in booklet.scenes" 
    :description="`highlight-color: ${scene.format.hltColor ? scene.format.hltColor : 'default'} | speed: ${scene.format.speed ? scene.format.speed : 'default'}`"
    )
      label {{ scene.title }}
      b-form-textarea.booklet-create(
      :id="`scene:${index}`"
      :value="scene.text" 
      size="sm" rows="5" 
      :formatter="formatScene"
      :style="`${scene.format.color ? 'color: ' + scene.format.color : ''}${scene.format.bgColor ? ' background: ' + scene.format.bgColor : ''}`"
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
      this.showPasteBox = !this.showPasteBox
    },
    formatScene(value, e) {
      let n = value.split('\n')

      n = n.map(line => {
        if (line.substring(0,2) === '!/' && line.substring(line.length - 1) === '/') {
          if (this.processCmd(line.substring(2, line.length - 1), e.target)){
            return '' 
          }
        }
          return line
      })

      return n.join('\n');
    },
    processCmd(cmd, elem) {
      let eqI = cmd.indexOf('=')
      let command = cmd
      let payload = ''
      if (eqI > -1) {
        command = cmd.substring(0, eqI)
        payload = cmd.substring(eqI + 1)
      }
      let sceneI = elem.id.split(':')[1]
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
