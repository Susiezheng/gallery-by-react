require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

/*let yeomanImage = require('../images/yeoman.png');*/

//获取图片相关数据
let imageDatas=require('../data/imageDatas.json');

//定义一个函数遍历图片文件名，自执行来把文件信息转化成URL路径信息
imageDatas = ((imageDatasArr) => {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);
/*imageDatas=genImageURL(imageDatas);*/

//获取区间内的一个随机值
var getRangeRandom = (low,high) => {
  return Math.floor(Math.random() * (high - low) + low);
};

//获取0-30度之间的一个任意正负值
var get30DegRandom =() => {
  let deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
}

//定义一个图片组件
class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  //点击翻转的函数
  handleClick(e){

    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();

  }

  render(){
    let styleObj = {};
    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度不为0 ，旋转
    if(this.props.arrange.rotate) {
        let rotate = this.props.arrange.rotate;
        (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
          styleObj[value] = 'rotate(' + rotate + 'deg)';
        });
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';


    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
                {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
      )
  }
}

//控制组件
class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  //点击翻转的函数
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();

  }
  render(){
    var controllerUnitClassName = "controller-unit";
    //如果对应的是居中的图片，显示控制按钮的居中状态
    if(this.props.arrange.isCenter){
      controllerUnitClassName += " is-center";
        if(this.props.arrange.isInverse){
          controllerUnitClassName += " is-inverse";
        }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}>
      </span>
      )
  }
}

class AppComponent extends React.Component {
  constructor(props){
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            vPosRange: {
                x: [0, 0],
                topY: [0, 0]
            },
            //水平方向的取值范围
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            }
        }
        this.state = {
            imgsArrangeArr: [
                /*{
                    pos:{
                        left: 0,
                        top: 0
                    },
                    rotate: 0,//旋转角度
                    isInverse: false//图片正反面
                    isCenter:false 图片是否居中
                }*/
            ]
        }
    }

  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {function} 这是一个闭包函数，其内return一个真正待被执行的函数
  */
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr : imgsArrangeArr
      })
    }
  }

  /**
   * 利用 rearrange 函数，居中对应index的图片
   * @param index， 需要被居中的图片对应的图片信息数组的index值
   * return {function}
   */
  center(index){
    return () => {
      this.rearrange(index);
    };
  }

  /*
  * 重新布局所有图片
  * @param centerIndex指定居中排定哪个图片
  */
  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        topImgNum = Math.floor(Math.random() * 2),//取一个或者不取
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1)

        //首先居中centerIndex的图片
        //居中的centerIndex不需要旋转
        imgsArrangeCenterArr[0] = {
          pos : centerPos,
          rotate : 0,
          isCenter:true
        };

        //去除要布局上册的图片的状态信息
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        let imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上册的图片
        imgsArrangeTopArr.forEach((value,index) => {
          imgsArrangeTopArr[index] = {
            pos : {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate : get30DegRandom(),
            isCenter : false
          };
        });

        for(let i = 0,j = imgsArrangeArr.length,k = j / 2;i < j;i++){
          let hPosRangeLORX = null;

          //前半部分布局左边，右半部分布局右边
          if(i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          }else {
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos : {
              top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
            },
            rotate : get30DegRandom(),
            isCenter : false

          };

        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr : imgsArrangeArr
        });

  }

/*  getInitialState(){
    return {
      imgsArrangeArr : [
      {
          pos : {
            left : 0,
            top : 0
          }
      }

      ]
    };
  }*/

  //组件加载后，为每张图片计算其位置
  componentDidMount(){

    //获取舞台对象和对象的参数
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,

          halfStageW = Math.ceil(stageW / 2),
          halfStageH = Math.ceil(stageH / 2);

        //拿到一个imgFigure的大小

        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigures0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
         //计算左侧,右侧区域图片排布的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        let num = Math.floor(Math.random() * 10);
        //图片用第一个开始展示，如果是要每次展开不同，使用num
        this.rearrange(0);
  }

  render() {
    let controllerUnits = [],
        imgFigures = [];

        imageDatas.forEach((value, index) =>{
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate : 0,
                    isInverse : false
                }
            }
            imgFigures.push(
                <ImgFigure
                    data = {value}
                    key={index}
                    ref={'imgFigures'+index}
                    arrange = {this.state.imgsArrangeArr[index]}
                    inverse={this.inverse(index)}
                    center={this.center(index)} />
                );

            controllerUnits.push(<ControllerUnit
            key={index}
            arrange={this.state.imgsArrangeArr[index]}
            inverse={this.inverse(index)}
            center={this.center(index)} />)
        });

    return (
        <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <section className="controller-nav">
                    {controllerUnits}
                </section>
        </section>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
