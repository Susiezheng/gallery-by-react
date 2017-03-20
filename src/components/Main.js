require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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

class ImgFigure extends React.Component{
  render(){
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
      )
  }
};

class AppComponent extends React.Component {
  render() {
    let imgFigures = [],
        controllerUnits = [];
    imageDatas.forEach((value)=>{
      imgFigures.push(<ImgFigure data={value} />);
    })
    return (
        <section className="stage" >
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
        </section>
    )
  }
};

AppComponent.defaultProps = {
};

export default AppComponent;
