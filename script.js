// Tab navigation
const tabs=document.querySelectorAll('.tab-link');
const contents=document.querySelectorAll('.tab-content');
tabs.forEach(tab=>{
  tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('current'));
    tab.classList.add('current');
    const target=tab.getAttribute('data-tab');
    contents.forEach(c=>c.classList.remove('current'));
    document.getElementById(target).classList.add('current');
  });
});

// Three.js 3D setup
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x333333);
const camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,1.6,3);
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('renderArea'),antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
const controls=new THREE.OrbitControls(camera,renderer.domElement); controls.target.set(0,1,0); controls.update();

// Lights
scene.add(new THREE.HemisphereLight(0xffffff,0x444444,1));
const dirLight=new THREE.DirectionalLight(0xffffff,0.8); dirLight.position.set(5,10,5); scene.add(dirLight);
scene.add(new THREE.GridHelper(10,10));

let currentModel=null;
const loader=new THREE.GLTFLoader();
const modelPaths={
  male:"https://raw.githubusercontent.com/ChatGPT-GTA/Models/main/mp_m_freemode_01.glb",
  female:"https://raw.githubusercontent.com/ChatGPT-GTA/Models/main/mp_f_freemode_01.glb"
};

function loadModel(gender){if(currentModel) scene.remove(currentModel);
loader.load(modelPaths[gender],gltf=>{currentModel=gltf.scene; currentModel.scale.set(1,1,1); currentModel.position.set(0,0,0); scene.add(currentModel); applyColors();});}
loadModel('male');

// Inputs
const componentsDiv=document.getElementById('components');
for(let i=0;i<=11;i++){const d=document.createElement('input'); d.placeholder='Drawable '+i; d.id='comp_draw_'+i;
const t=document.createElement('input'); t.placeholder='Texture '+i; t.id='comp_tex_'+i; componentsDiv.appendChild(d); componentsDiv.appendChild(t);}
const propsDiv=document.getElementById('props');
for(let i=0;i<=7;i++){const d=document.createElement('input'); d.placeholder='Drawable Prop '+i; d.id='prop_draw_'+i;
const t=document.createElement('input'); t.placeholder='Texture Prop '+i; t.id='prop_tex_'+i; propsDiv.appendChild(d); propsDiv.appendChild(t);}

// Model selector
document.getElementById('modelSelect').addEventListener('change',e=>{loadModel(e.target.value);});

// Colors
function applyColors(){if(!currentModel)return;
const mainColor=document.getElementById('colorMain').value;
const secColor=document.getElementById('colorSecondary').value;
currentModel.traverse(c=>{if(c.isMesh){c.material.color.set(mainColor);}});}
document.getElementById('colorMain').addEventListener('input',applyColors);
document.getElementById('colorSecondary').addEventListener('input',applyColors);

// Presets
const presetData={
  urbano:{components:{3:{drawable:15,texture:0},4:{drawable:34,texture:1}},props:{1:{drawable:4,texture:1}}},
  militar:{components:{3:{drawable:25,texture:2},4:{drawable:45,texture:0}},props:{1:{drawable:2,texture:0}}},
  casual:{components:{3:{drawable:10,texture:0},4:{drawable:20,texture:0}},props:{1:{drawable:0,texture:0}}}
};
function loadPreset(name){const p=presetData[name]; if(!p)return;
for(let i=0;i<=11;i++){document.getElementById('comp_draw_'+i).value='';document.getElementById('comp_tex_'+i).value='';}
for(let i=0;i<=7;i++){document.getElementById('prop_draw_'+i).value='';document.getElementById('prop_tex_'+i).value='';}
for(let i in p.components){document.getElementById('comp_draw_'+i).value=p.components[i].drawable;document.getElementById('comp_tex_'+i).value=p.components[i].texture;}
for(let i in p.props){document.getElementById('prop_draw_'+i).value=p.props[i].drawable;document.getElementById('prop_tex_'+i).value=p.props[i].texture;}}

// Build JSON
function buildOutfit(){const name=document.getElementById('outfitName').value||'Outfit';const model=(document.getElementById('modelSelect').value==='male')?'mp_m_freemode_01':'mp_f_freemode_01';
const outfit={name:name,model:model,components:{},props:{}};for(let i=0;i<=11;i++){const d=document.getElementById('comp_draw_'+i).value;const t=document.getElementById('comp_tex_'+i).value;if(d!=='') outfit.components[i]={drawable:parseInt(d)||0,texture:parseInt(t)||0};}
for(let i=0;i<=7;i++){const d=document.getElementById('prop_draw_'+i).value;const t=document.getElementById('prop_tex_'+i).value;if(d!=='') outfit.props[i]={drawable:parseInt(d)||0,texture:parseInt(t)||0};}return outfit;}

// Buttons
document.getElementById('generateBtn').addEventListener('click',()=>{const outfit=buildOutfit(); alert(JSON.stringify(outfit,null,2));});
document.getElementById('downloadBtn').addEventListener('click',()=>{const outfit=buildOutfit(); const filename=outfit.name.replace(/[\\\/:*?"<>|]+/g,'_')+'.json';
const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(outfit,null,2)); const dlAnchor=document.createElement('a'); dlAnchor.setAttribute('href',dataStr); dlAnchor.setAttribute('download',filename); document.body.appendChild(dlAnchor); dlAnchor.click(); dlAnchor.remove();});

// Community button
document.getElementById('downloadCommunityBtn').addEventListener('click',()=>{const outfit=buildOutfit(); const filename='community_'+outfit.name.replace(/[\\\/:*?"<>|]+/g,'_')+'.json';
const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(outfit,null,2)); const dlAnchor=document.createElement('a'); dlAnchor.setAttribute('href',dataStr); dlAnchor.setAttribute('download',filename); document.body.appendChild(dlAnchor); dlAnchor.click(); dlAnchor.remove();});

// Animate
function animate(){requestAnimationFrame(animate);renderer.render(scene,camera);}
animate();
window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
