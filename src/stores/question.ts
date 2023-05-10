import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
import api from '../services/api'
import _ from 'lodash'
import { useIndexStore } from './index'
const typpName =[
    {key:'totalF1',value:'躯体化'},
    {key:'totalF2',value:'强迫症状'},
    {key:'totalF3',value:'人际关系敏感性'},
    {key:'totalF4',value:'抑郁'},
    {key:'totalF5',value:'焦虑'},
    {key:'totalF6',value:'敌意'},
    {key:'totalF7',value:'恐惧症状'},
    {key:'totalF8',value:'妄想'},
    {key:'totalF9',value:'精神病性症状'},
]
export const questionIndexStore = defineStore({
    id: 'question',
    state: () => ({
        userScore: {
        },
        infoScore:{
            totalSocreText:null,
            positiveNum:0,
            negativeNum:0,
            infoText:null

        },
        myResult: {},
        resultNum: {},
        chatList:[],
        questionValue: [],
        questionsList: [  // 页面渲染时需遍历的对象  对应下面vue页面的questionsList
        ],

    }),
    getters: {

    },
    actions: {

        async AswerLoad() {
            const data = await api.post('user/questionList')
            this.questionsList =data.data.data
            this.questionValue = _.times(this.questionsList.length, () => 0);

        },
        async getAswer() {
             const { data } = await api.post('user/getUserInfo')
             if(data.code ==0){
                const {scoreF1,scoreF2,scoreF3,scoreF4,scoreF5,scoreF6,scoreF7,scoreF8,scoreF9,scoreF10 ,
                    totalF1,totalF2,totalF3,totalF4,totalF5,totalF6,totalF7,totalF8,totalF9,totalF10
                } =data.data.userScore
                this.resultNum={ totalF1,totalF2,totalF3,totalF4,totalF5,totalF6,totalF7,totalF8,totalF9,totalF10}
                this.myResult={scoreF1,scoreF2,scoreF3,scoreF4,scoreF5,scoreF6,scoreF7,scoreF8,scoreF9,scoreF10 }
                const pairs = _.toPairs(this.resultNum);
                const newPars =_.dropRight(pairs);
                this.chatList= _.map(newPars, pair => ({  value: pair[1] ,name:_.find(typpName, item => item.key==pair[0])?.value}));
           
             }
          
        },
        text(){
           const totalSocre = _.sum(_.values(this.resultNum))/90
           let totalSocreText 
           if( totalSocre>1 && totalSocre<=1.5 )  totalSocreText="没有症状" 
           if( totalSocre>1.5 && totalSocre<=2.5 )  totalSocreText="有点症状" 
           if( totalSocre>2.5 && totalSocre<=3.5 )  totalSocreText="有症状，其严重程度为轻到中度" 
           if( totalSocre>3.5 && totalSocre<=4.5 )  totalSocreText="有症状，其程度为中到严重"
           if( totalSocre>4.5 && totalSocre<=5 )  totalSocreText="症状的频度和强度都十分严重。" 
           const positiveNum  =_.size(_.filter(this.myResult, (value) => value > 2));
           const negativeNum =_.size(_.filter(this.myResult, (value) => value == 1));
           let SomatizationText ,ObsessiveCompulsiveText ,InterpersonalSensitivityText ,DepressionText,AnxietyText,HostilityText,
           PhobicAnxietyText,ParanoidIdeationText,PsychoticismText

           if(this.resultNum.totalF1>36){
             SomatizationText='身体上有较明显的不适感，并常伴有头痛、肌肉酸痛等症状;' 
           }
           if( this.resultNum.totalF2>30 ){
            ObsessiveCompulsiveText='强迫症状较明显;'
           }
           if( this.resultNum.totalF3>27){
            InterpersonalSensitivityText='人际关系较为敏感，人际交往中自卑感较强，并伴有行为症状（如坐立不安，退缩)等;'
           }
           if( this.resultNum.totalF4>39){
            DepressionText='抑郁程度较强，生活缺乏足够的兴趣，缺乏运动活力，极端情况下，可能会有想死亡的思想和自杀的观念;'
           }else if( this.resultNum.totalF4<26){
            DepressionText='体抑郁程度较弱，生活态度乐观积极，充满活力，心境愉快; '
            
           }
           if( this.resultNum.totalF5>30){
            AnxietyText='易焦虑，易表现出烦躁、不安静和神经过敏，极端时可能导致惊恐发作;' 
           }else if( this.resultNum.totalF5<20){
            AnxietyText='不易焦虑，易表现出安定的状态;'
           }
           if( this.resultNum.totalF6>18){
            HostilityText='敌对的思想、情感和行为;' 
           }else if( this.resultNum.totalF6<12){
            HostilityText='友好的思想、情感和行为;'
           }
           if( this.resultNum.totalF7>21){
            PhobicAnxietyText='体恐怖症状较为明显，常表现出社交、广场和人群恐惧;' 
           }
           if( this.resultNum.totalF8>18){
            ParanoidIdeationText='偏执症状明显，较易猜疑和敌对;' 
           }
           if( this.resultNum.totalF9>30){
            PsychoticismText='精神病性症状较为明显;' 
           }
           const infoText =_.join([ SomatizationText ,ObsessiveCompulsiveText ,InterpersonalSensitivityText ,DepressionText,AnxietyText,HostilityText,
            PhobicAnxietyText,ParanoidIdeationText,PsychoticismText], "")
           this.infoScore={
                totalSocreText,
                positiveNum,
                negativeNum,
                infoText
            }
        },
        async submitSult(result, resultNum) {
            const useIndex = useIndexStore()
            const { id } = useIndex.useAuth
            this.myResult = result
            this.resultNum = resultNum
            await api.post('user/submitQuestion', { userId: id, ...result, ...resultNum })
            Taro.setStorage({
                key: 'resultNum',
                data: JSON.stringify(resultNum)
            })
            Taro.setStorage({
                key: 'myResult',
                data: JSON.stringify(result)
            })
        },
        updataList(list) {
            this.questionsList = list
        },
        getStorageSync(key: string) {
            const value = Taro.getStorageSync(key)
            if (value) this[key] = JSON.parse(value)
        },
        setStorage(key: string, value: any) {
            const data = JSON.stringify(value)
            Taro.setStorage({
                key,
                data
            })
        },




    },
})
