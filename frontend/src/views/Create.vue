<template lang="pug">
  div#syntax-playground
    b-row#create-header
      b-col(xs="8") {{ booklet.title }}
      b-col(xs="4") {{ booklet.author }}
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

  },
  created() {
    // this.bookletText = "!/title=" +
    //                    "\n!/author=" +
    //                    "\n" +
    //                    "\n!/title=Intro, color=red, bg-color=black" +
    //                    "\n" + 
    //                    "\n!/title=Scene 1, speed=slower" + 
    //                    "\n" +
    //                    "\n!/" + 
    //                    "\nseparates scene, but with default options";
  }
}
</script>

<style lang="sass">
</style>
