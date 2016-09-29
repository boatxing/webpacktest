var React = require("./react.js");
var ReactDom = require("./reactdom.js");

    //var ContentItem = require("./contentItemComponent").getContentItem();
    //require("./contentItemComponent");
    //内容item
    var ContentItem = React.createClass({
        edit: function(){
            pubsubflux.publish("contentItemEdit", this.props.data.pageId, this.props.data.path);
        },
        moveUp: function(){
            pubsubflux.publish("contentItemMove",  this.props.data.pageId, this.props.data.path, 0);
        },
        moveDown: function(){
            pubsubflux.publish("contentItemMove",  this.props.data.pageId, this.props.data.path, 1);
        },
        moveTop: function(){
            pubsubflux.publish("contentItemMove",  this.props.data.pageId, this.props.data.path, 2);
        },
        moveBottom: function(){
            pubsubflux.publish("contentItemMove",  this.props.data.pageId, this.props.data.path, 3);
        },
        del: function(){
            pubsubflux.publish("contentItemDel",  this.props.data.pageId, this.props.data.path);
        },
        render: function () {
            var ppmsItemData = this.props.data;
            var display = ppmsItemData.show == 1 ? '' : ppmsItemData.show == 0 ? 'none' : '';
            return (
                <tr className='o_tableceil' id={ppmsItemData.ppmsItemId} style={{display: display}}>
                    <td className="text-center">{this.props.index}</td>
                    <td>{ppmsItemData.ppms_itemName}</td>
                    <td className="text-center">
                        <a href="javascript:void(0)" operate="o_top" title="置顶" onClick={this.moveTop}>
                            <span className="fa fa-arrow-circle-up"></span>
                        </a>
                    &nbsp;&nbsp;
                        <a href="javascript:void(0)" operate="o_bottom" title="置底" onClick={this.moveBottom}>
                            <span className="fa fa-arrow-circle-down"></span>
                        </a>
                    &nbsp;&nbsp;
                        <a href="javascript:void(0)" operate="o_up" title="上移" onClick={this.moveUp}>
                            <span className="fa fa-arrow-up"></span>
                        </a>
                    &nbsp;&nbsp;
                        <a href="javascript:void(0)" operate="o_down" title="下移" onClick={this.moveDown}>
                            <span className="fa fa-arrow-down"></span>
                        </a>
                    &nbsp;&nbsp;
                        <a href="javascript:void(0)" operate="o_del" onClick={this.del}>
                            <span className="fa fa-times"></span>
                        </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="javascript:void(0)" data-toggle="modal" tag="o_table_edit" onClick={this.edit}>编辑</a>
                    </td>
                </tr>
            );
        }
    });

    //内容表
    var ContentTable = React.createClass({
        render: function() {
            return (
                <table className="table table-bordered table-condensed table-hover table-striped">
                    <tbody className="listbody">
                  {
                      this.props.pageData.map(function(item, index){
                          return (<ContentItem key={item.ppmsItemId} data={item} index={index+1}/>)
                      })
                      }
                    </tbody>
                </table>);
        }
    })

    //页面片panel
    var SegmentPanel = React.createClass({
        getInitialState: function(){
            return {fold: 1}
        },
        componentDidMount: function(){
            //展开
            pubsubflux.subscribe("SegmentPanelUnfold", function(pageId){
                if(pageId != this.props.page.pageInfo.id){
                    return false;
                }
                console.log("SegmentPanelUnfold subscribe");
                this.setState({fold: 0});
                pubsubflux.publish("ContentTableUnfold",  this.props.page.pageInfo.id);
            }.bind(this));
        },
        componentWillUnmount: function(){
            pubsubflux.unsubscribe("SegmentPanelUnfold");
        },
        addItem: function(){
            console.log("publish contentformaddlevel1", this.props.page.pageInfo.id);
            pubsubflux.publish("contentformaddlevel1", this.props.page.pageInfo.id);
        },
        foldToggle: function(){
            console.log("foldToggle", this.state.fold);
            var fold = this.props.page.pageData.length <= 10 ? 0 : this.state.fold == 0 ? 1 : 0;
            this.setState({fold: fold});
            if(fold == 0){
                pubsubflux.publish("ContentTableUnfold",  this.props.page.pageInfo.id);
            }else{
                pubsubflux.publish("ContentTableFold",  this.props.page.pageInfo.id);
            }
        },
        delete: function(){
            console.log("segmentDel", this.props.page.pageInfo.id);
            pubsubflux.publish("segmentDel",  this.props.page.pageInfo.id);
        },
        save: function() {
            console.log("segmentSave", this.props.page.pageInfo.id);
            pubsubflux.publish("segmentSave", this.props.page.pageInfo.id);
        },
        toGamma: function() {
            console.log("segment2Gamma", this.props.page.pageInfo.id);
            pubsubflux.publish("segment2Gamma", this.props.page.pageInfo.id);
        },
        toIdc: function() {
            console.log("segment2Idc", this.props.page.pageInfo.id);
            pubsubflux.publish("segment2Idc", this.props.page.pageInfo.id);
        },
        handExport: function(){ //导出
            console.log("segmentExport", this.props.page.pageInfo.id);
            pubsubflux.publish("segmentExport", this.props.page.pageInfo.id);
        },
        handImport: function(e){ //倒入
            console.log("segmentImport", this.props.page.pageInfo.id);
            pubsubflux.publish("segmentImport", this.props.page.pageInfo.id, "pageData", e.target.files);
        },
        lock:function(e){//锁定
            console.log("segmentLock", this.props.page.pageInfo.id);
            pubsubflux.publish("segmentLock", this.props.page.pageInfo.id);
        },
        unlock:function(e){//锁定
            console.log("segmentUnLock", this.props.page.pageInfo.id);
            pubsubflux.publish("segmentUnLock", this.props.page.pageInfo.id);
        },
        render: function () {
            var page = this.props.page;
            var fold = this.state.fold == 1 && page.pageData.length > 10 ? 'fa fa-angle-up' : 'fa fa-angle-down';
            var foldDisabled = page.pageData.length > 10 ? "" : "disabled";
            var lockuser = page.pageInfo.lockuser;
            var lastModify=page.pageInfo.lastModify;
            return(
                <li data-itemid={page.pageInfo.id}>
                    <div className="box">
                        <header>
                            <h5>{page.pageInfo.id}:{page.pageInfo.info}</h5>
                            <span className="label label-warning" style={{display:lockuser == "" ? 'none' : ''}}>被{lockuser}锁定</span>
                            <div className="toolbar text-right">
                                <div className="btn-group">
                                    <a href="javascript:void(0)" disabled={foldDisabled} title={fold=="fa fa-angle-up"?"展开":"收缩"}  className="btn btn-default btn-sm" data-placement="bottom"  data-toggle="tooltip" onClick={this.foldToggle}>
                                        <i className={fold}></i>
                                    </a>
                                    <a className="btn btn-danger btn-sm" data-placement="bottom" onclick={this.delete} title="删除" data-toggle="tooltip" onClick={this.delete}>
                                        <i className="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                        </header>
                        <header>
                        <div className="wrapper">
                            <span style={{display:lastModify == "" ? 'none' : ''}}>{lastModify}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="btn-group">
                                <a href="javascript:void(0)" className="btn btn-success btn-sm" data-placement="bottom" title="锁定" data-toggle="tooltip" tag="lock" onClick={this.lock}><span className="fa fa-lock"></span></a>
                                <a href="javascript:void(0)" className="btn btn-info btn-sm" data-placement="bottom" title="解锁" data-toggle="tooltip" onClick={this.unlock}><span className="fa fa-unlock"></span></a>
                            </div>
                        </div>
                    </header>
                        <div className="body">
                            <ContentTable pageData={page.pageData}/>
                        </div>
                        <footer>
                            <div className="row">
                                <div className="col-sm-8">
                                    <div className="btn-group">
                                        <a href="javascript:void(0)" className="btn btn-primary btn-sm" data-placement="bottom" title="保存" data-toggle="tooltip" tag="publish" from="local" onClick={this.save}><span className="fa fa-save"></span>&nbsp;保存</a>
                                        <a href="javascript:void(0)" className="btn btn-primary btn-sm" data-placement="bottom" title="发布GAMMA" data-toggle="tooltip" onClick={this.toGamma}><span className="glyphicon glyphicon-cloud-upload"></span>&nbsp;发布GAMMA</a>
                                        <a href="javascript:void(0)" className="btn btn-warning btn-sm" data-placement="bottom" title="发布IDC" data-toggle="tooltip" onClick={this.toIdc}><span className="fa fa-upload"></span>&nbsp;发布IDC</a>
                                    </div>
                                </div>
                                <div className="col-sm-4 text-right">
                                    <div className="btn-group">
                                        <a href="javascript:void(0)" className="btn btn-metis-5 btn-sm" data-placement="bottom" title="新增" data-toggle="tooltip" data-tag="addOuterCeil" onClick={this.addItem}>
                                            <span className="glyphicon glyphicon-plus"></span>
                                        </a>
                                        <a href="javascript:void(0)" className="btn btn-metis-5 btn-sm" data-placement="bottom" title="导出excel" data-toggle="tooltip"  onClick={this.handExport}>
                                            <span className="glyphicon glyphicon-export"></span>
                                        </a>
                                        <a href="javascript:void(0)" style={{overflow:"hidden"}} className="btn btn-metis-5 btn-sm" data-placement="bottom" title="导入excel" toggle="tooltip">
                                            <span className="glyphicon glyphicon-import"></span>
                                            <InputFile pageId={page.pageInfo.id} path="pageData" fileClassName="fileButton"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </li>
            );
        }
    })

    //内容编辑浮层
    var ContentEditorFloat = React.createClass({
        render: function(){
            return(
                <div className="row">
                    <div className="col-md-3" style={{borderRight:"1px solid #e5e5e5",paddingLeft: 0,fontSize:"12"}}>
                        <TreeView fold="0" treeNodes={this.props.treeNodes}/>
                    </div>
                    <SegmentLevelPanel pageData={this.props.pageData}/>
                </div>)
        }
    })

    //内容填写form
    var ContentForm = React.createClass({
        getInitialState: function(){
            return {
                error: 0,
                errorMsg: ''
            }
        },
        componentDidMount: function(){
            pubsubflux.subscribe("contentFormSubmit", this.save);
        },
        componentWillUnmount: function(){
            pubsubflux.unsubscribe("contentFormSubmit");
        },
        save: function(e){
            console.log("ContentForm save");
            console.log("form save", this.props.pageData.pageId, this.props.pageData.path, this.props.pageData.ppmsItemId);
            this.setState({error: 0, errorMsg: ''});
            var ppmsItemData = {ppmsItemId: this.props.pageData.ppmsItemId};
            console.log("check");
            var item = null, nick = "";
            for(var i = 0; i < this.props.pageData.ppmsDataTpl.length; i++){
                item = this.props.pageData.ppmsDataTpl[i];
                nick = item.nick;
                console.log(nick);
                item = this.refs[nick].check();
                //运营填写内容不允许有京乐享链接
                if(/\/\/union-click\.jd\.com\//.test(item[nick])){
                    item = {
                        error: 1,
                        errorMsg: "请勿填写cps链接union-click.jd.com"
                    }
                 }
                console.log(item);
                if(item.error){
                    console.log("check error");
                    this.setState(item);
                    return false;
                }

                $.extend(ppmsItemData, item);
            }
            console.log(ppmsItemData);
            pubsubflux.publish("contentformsave",
                this.props.pageData.pageId, this.props.pageData.path, ppmsItemData);
        },
        render: function(){
            var pagaData = this.props.pageData;
            var dataTpl = this.props.pageData.ppmsDataTpl;
            // var InputControl = if()
            return (
                <form className="form-horizontal" onsubmit="javascript:return false;">
				    {dataTpl.map(function(item){
                        if(item.type == 'text'){
                            return <TxtInput ref={item.nick} key={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'textarea'){
                            return <TextareaInput ref={item.nick} key={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'select'){
                            return <SelectInput ref={item.nick} key={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'url'){
                            return <UrlInput ref={item.nick} key={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'img'){
                            return <ImageInput ref={item.nick} key={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'date'){
                            return <DateInput ref={item.nick} key={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'checkbox'){
                            return <CheckboxInput ref={item.nick} key={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'radio'){
                            return <RadioInput ref={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                        if(item.type == 'level'){
                            return <LevelInput key={item.nick} ref={item.nick} dataTpl={item} value={pagaData[item.nick]}/>
                        }
                    })}
                    <div style={{display: this.state.error ? '' : 'none'}} className="alert alert-danger alert-dismissible" role="alert">
                        <strong>校验错误：</strong> {this.state.errorMsg}
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="button" onClick={this.save} className="btn btn-default">保存</button>
                        </div>
                    </div>
                </form>
            )
        }
    })

    //文件上传输入框
    var InputFile = React.createClass({
        handImport: function(e){ //导入
            console.log("segmentImport", this.props.pageId, this.props.path);
            var files = e.target.files;
            var target = e.target;
            pubsubflux.publish("segmentImport", this.props.pageId, this.props.path, files, function(){
                //解决第二次选择相同的文件，不会触发onChange
                target.value = "";
            });
        },
        render: function(){
            return <input className={this.props.fileClassName} type="file" onChange={this.handImport}/>
        }
    })

    //多级内容Panel
    var SegmentLevelPanel = React.createClass({
        addItem: function(){
            pubsubflux.publish("contentformadd",
                this.props.pageData.pageId, this.props.pageData.path);
        },
        handExport: function(){ //导出
            console.log("segmentExport", this.props.pageData.pageId, this.props.pageData.path);
            pubsubflux.publish("segmentExport", this.props.pageData.pageId, this.props.pageData.path);
        },
        render: function(){
            if(!$.isArray(this.props.pageData)){
                return (
                    <div className="col-md-9">
                        <p>正在编辑：
                            <span className="label label-info">{this.props.pageData.ppms_itemName}</span>
                        </p>
                        <div style={{width: "100%", border: "1px solid rgb(229, 229, 229)", borderRadius: "3px; padding: 10px"}} id="contentFormPanel">
                            <ContentForm key={this.props.pageData.ppmsItemId} pageData={this.props.pageData}/>
                        </div>
                    </div>)
            }else{
                return(
                    <div className="col-md-9">
                        <p>正在编辑：
                            <span className="label label-info">{this.props.pageData.ppms_itemName}</span>
                        </p>
                        <div>
                            <a href="javascript:void(0)" className="btn btn-primary btn-xs" style={{float: "right",marginTop: "-30",marginRight: "90"}} onClick={this.handExport}>导出</a>
                            <a href="javascript:void(0)" className="btn btn-primary btn-xs" style={{float: "right",marginTop: "-30",marginRight: "45"}}>导入</a>
                            <div style={{float: "right",marginTop: "-30",marginRight: "45",width:36,height:22,opacity:0,overflow: "hidden"}}>
                                <InputFile fileClassName="" pageId={this.props.pageData.pageId} path={this.props.pageData.path}/>
                            </div>
                            <a href="javascript:void(0)" className="btn btn-primary btn-xs" style={{float: "right",marginTop: "-30"}} onClick={this.addItem}>新增</a>
                            <ContentTable key={this.props.pageData.ppmsItemId} pageData={this.props.pageData}/>
                        </div>
                    </div>)
            }
        }
    })

    //左边树
    var TreeView = React.createClass({
        render: function(){
            var display = this.props.fold == 0 ? 'block' : 'none'
            return(
                <ul className="listul" style={{display: display}}>
				{
                    this.props.treeNodes.map(function(node){
                        return <TreeNode key={node.id} nodeData={node}/>
                    }.bind(this))
                    }

                </ul>)
        }
    })

    //树节点
    var TreeNode = React.createClass({
        handClick: function(){
            console.log("publish treeNodeClick");
            pubsubflux.publish("treeNodeClick", this.props.nodeData.pageId, this.props.nodeData.path);
        },
        render: function(){
            var node = this.props.nodeData;
            var fold = node.fold == 0 ? 'unfolded' : 'folded';
            var selected = node.selected ? 'selected' : '';
            var calssName = fold + " " + selected;
            if(node.nodes){
                return (<li className={calssName}><a data-id={node.id} data-pid={node.pId} onClick={this.handClick} className="lftlist" href="javascript:void(0)">{node.text}</a><TreeView fold={node.fold} treeNodes={node.nodes}/></li>)
            }else{
                return (<li className={selected}><a onClick={this.handClick} data-id={node.id} data-pid={node.pId} className="lftlist" href="javascript:void(0)">{node.text}</a></li>)
            }
        }
    })

    //文本输入框
    var TxtInput = React.createClass({
        getInitialState: function(){
            return {
                name: this.props.dataTpl.nick,
                value: this.props.value == null ? "" : ""+this.props.value
            }
        },
        handChange: function(event){
            this.setState({value: $.trim(event.target.value)});
        },
        check: function(){
            console.log("TxtInput check");
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(this.state.value == ""){
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }
            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }


            var data = {};
            data[this.state.name] = ""+this.state.value;
            console.log(data);
            return data;
        },
        render: function(){
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-9">
                        <input onChange={this.handChange} name={this.props.dataTpl.nick} type="text" className="form-control" placeholder={this.props.dataTpl.name} defaultValue={this.props.value}/>
                    </div>
                </div>
            )
        }
    })

    //textarea输入框
    var TextareaInput = React.createClass({
        getInitialState: function(){
            return {
                name: this.props.dataTpl.nick,
                value: this.props.value||""
            }
        },
        handChange: function(event){
            this.setState({value: $.trim(event.target.value)});
        },
        check: function(){
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(this.state.value == ""){
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }
            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }

            var data = {};
            data[this.state.name] = this.state.value;
            console.log(data);
            return data;
        },
        render: function(){
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-9">
                        <textarea onChange={this.handChange} name={this.props.dataTpl.nick} defaultValue={this.props.value} class="form-control" rows="3"></textarea>
                    </div>
                </div>
            )
        }
    })

    var SelectInput = React.createClass({
        getInitialState: function(){
            return {
                name: this.props.dataTpl.nick,
                value: this.props.value||""
            }
        },
        handChange: function(event){
            this.setState({value: $.trim(event.target.value)});
        },
        check: function(){
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(this.state.value == ""){
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }
            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }

            var data = {};
            console.log(data);
            data[this.state.name] = ""+this.state.value;

            return data;
        },
        render: function(){
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-9">
                        <select onChange={this.handChange} name={this.props.dataTpl.nick} defaultValue={this.props.value}>
                            <option key="-999" value="">请选择</option>
					        {
                                this.props.dataTpl.data.map(function(item){
                                    return <option key={item.value} value={item.value}>{item.name}</option>
                                })
                                }
                        </select>
                    </div>
                </div>
            )
        }
    })

    var LevelInput = React.createClass({
        check: function(){
            console.log("LevelInput check");
            var data = {};
            data[this.props.dataTpl.nick] = [];
            return data;
        },
        render: function(){
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-9">
                    保存后，点击左侧菜单新增
                    </div>
                </div>
            )
        }
    })

    //checkbox
    var CheckboxInput = React.createClass({
        getInitialState: function(){
            var values = this.props.value;
            values = values || "";
            values = values.split(";");
            var value = [];
            values.forEach(function(item){
                if(/^\w+$/.test(item)){
                    value.push(item);
                }
            });

            return {
                name: this.props.dataTpl.nick,
                value: value.length ? value.join(";") : ""
            }
        },
        handChange: function(event){
            console.log("checkbox handChange");
            var value = event.target.value;
            var values = this.state.value == "" ? [] : this.state.value.split(";");
            console.log(values);
            var index = values.indexOf(value);
            //如果选中取消选中
            if(index >= 0){
                values.splice(index, 1);
            }else{ //未选中，选中
                values.push(value);
            }
            values = values.length ? values.join(";") : "";
            console.log("values", values);
            this.setState({value: values});
        },
        check: function(){
            console.log("CheckboxInput check");
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(this.state.value == ""){
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }
            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }

            var data = {};
            data[this.state.name] = ""+this.state.value;
            console.log(data);
            return data;
        },
        render: function(){
            var value = this.props.value || "";
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-9">
						{this.props.dataTpl.data.map(function(item){
                            return(
                                <div className="checkbox">
                                    <label>
                                        <input onClick={this.handChange} defaultChecked={value.split(";").some(function(i){return item.value != "" && i == item.value}) ? 'checked' : ''} value={item.value} type="checkbox"/>{item.name}
                                    </label>
                                </div>)
                        }.bind(this))}
                    </div>
                </div>
            )
        }
    })

    //radio
    var RadioInput = React.createClass({
        getInitialState: function(){
            return {
                name: this.props.dataTpl.nick,
                value: this.props.value||""
            }
        },
        handChange: function(event){
            console.log("radio handChange");
            var value = event.target.value;
            this.setState({value: value});
        },
        check: function(){
            console.log("TxtInput check");
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(this.state.value == ""){
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }
            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }

            var data = {};
            data[this.state.name] = ""+this.state.value;
            console.log(data);
            return data;
        },
        render: function(){
            var value = this.props.value || "";
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-9">
						{this.props.dataTpl.data.map(function(item){
                            return(
                                <div className="radio" key={item.value}>
                                    <label>
                                        <input onClick={this.handChange} defaultChecked={value ==  item.value ? 'checked' : ''} name={this.props.dataTpl.nick} value={item.value} type="radio"/>{item.name}
                                    </label>
                                </div>)
                        }.bind(this))}
                    </div>
                </div>
            )
        }
    })

    var UrlInput = React.createClass({
        getInitialState: function(){
            var url = parseUrl(this.props.value);
            return {
                name: this.props.dataTpl.nick,
                value: this.props.value||"",
                ptag: url ? url.params.ptag||url.params.PTAG||"" : ""
            }
        },
        handChange: function(event){
            this.setState({value: $.trim(event.target.value)});
            var url = parseUrl($.trim(event.target.value));
            var ptag = url ? url.params.ptag||url.params.PTAG||"" : "";
            ptag != "" && this.setState({ptag: ptag});
        },
        setPtag: function(event){
            this.setState({ptag: $.trim(event.target.value)});
            this.setState({value: addUrlRd(this.state.value, $.trim(event.target.value))});
        },
        check: function(){
            console.log("URLInput check");
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(this.state.value == ""){
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }
            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }

            //检查连接是否合法
            if(this.state.value && !parseUrl(this.state.value)){
                return {
                    error: 1,
                    errorMsg: this.props.dataTpl.name + '不合法'
                }
            }

            var data = {};
            data[this.state.name] = this.state.value;
            //增加rd
            if(this.state.ptag && this.state.value) {
                var url = addUrlRd(this.state.value, this.state.ptag);
                data[this.state.name] = url;
                this.setState({value: url});
            }

            console.log(data);
            return data;
        },
        render: function(){
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-5">
                        <input type="text" value={this.state.value} onChange={this.handChange} name={this.props.dataTpl.nick} className="form-control" defaultValue={this.props.value}/>
                    </div>
                    <div className="col-sm-4">
                        <input type="text" style={{display: "inline", marginRight: '5px', width: "70px"}} onChange={this.setPtag} className="form-control" placeholder="ptag" value={this.state.ptag}/>
                        <a style={{display: "inline"}} className="btn btn-default" href={this.state.value} role="button" target="_blank">预览</a>
                    </div>
                </div>
            )
        }
    })

    var ImageInput = React.createClass({
        getInitialState: function(){
            return {
                name: this.props.dataTpl.nick,
                value: this.props.value||""
            }
        },
        handChange: function(event){
            this.setState({value: $.trim(event.target.value)});
        },
        check: function(){
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(this.state.value == ""){
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }
            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }

            var data = {};
            console.log(data);
            data[this.state.name] = this.state.value;

            return data;
        },
        handUpload: function(e){
            var that = this;
            var target = e.target;
            pubsubflux.publish("imageUplad", e.target.files, function(url){
                that.setState({value: url});
                target.value = "";
            });
        },
        render: function(){
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-6">
                        <input type="text" onChange={this.handChange} value={this.state.value} name={this.props.dataTpl.nick} className="form-control" placeholder={this.props.dataTpl.name} defaultValue={this.props.value}/>
                    </div>
                    <div className="col-sm-3">
                        <a style={{display: "inline", marginRight: '5px'}} className="btn btn-default" href="javascript:void(0)" role="button" target="_blank">上传</a>
                        <input type="file" style={{position: "absolute", top: "0px", left: "0px", width:"54px", height: "40px", opacity: "0"}} onChange={this.handUpload}/>
                        <a style={{display: "inline"}} className="btn btn-default" href={this.state.value} role="button" target="_blank">预览</a>
                    </div>
                </div>
            )
        }
    })

    var DateInput = React.createClass({
        getInitialState: function(){
            return {
                name: this.props.dataTpl.nick,
                value: this.props.value||""
            }
        },
        componentDidMount: function(){
            var that = this;
            $(ReactDOM.findDOMNode(this.refs.dateInput)).datetimepicker({
                format: 'Y/m/d H:i:s',
                value: this.state.value,
                lang: 'zh',
                onChangeDateTime: function(c, $input){
                    that.setState({value: $input.val()})
                }
            });
        },
        handChange: function(event){
            this.setState({value: $.trim(event.target.value)});
        },
        check: function(){
            var dataValue = this.state.value;
            if(typeof this.props.dataTpl.empty != "undefined" && !this.props.dataTpl.empty){
                if(dataValue == "") {
                    return {
                        error: 1,
                        errorMsg: this.props.dataTpl.name + '不能为空'
                    }
                }
            }

            //检查日志格式是否合法 yyyy/mm/dd hh:ii:ss
            if(dataValue != "" && !/^\d{4}\/\d{1,2}\/\d{1,2}$|^\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}$/.test(dataValue)){
                return {
                    error: 1,
                    errorMsg: this.props.dataTpl.name + '格式不合法'
                }
            }

            var validators = this.props.dataTpl.validators;
            if(validators){
                for(var i = 0; i < validators.length; i++){
                    if(!new RegExp(validators[i].reg).test(this.state.value)){
                        return {
                            error: 1,
                            errorMsg: validators[i].errorMsg
                        }
                    }
                }
            }

            var data = {};
            console.log(data);
            data[this.state.name] = this.state.value;

            return data;
        },
        render: function(){
            return (
                <div className="form-group">
                    <label className="col-sm-3 control-label">{this.props.dataTpl.name}</label>
                    <div className="col-sm-9">
                        <input type="text" ref="dateInput" onChange={this.handChange} name={this.props.dataTpl.nick} className="form-control" placeholder="格式：yyyy/mm/dd hh:ii:ss" defaultValue={this.props.value}/>
                    </div>
                </div>
            )
        }
    })


    var PageContainer = React.createClass({
        render: function(){
            return(
                <ul className="tiles-wrap">
			    {
                    this.props.pageList.map(function(pageItem){
                        return <SegmentPanel key={pageItem.pageInfo.id} page={pageItem}/>
                    })
                    }
                </ul>)
        }
    })

    exports.updateWook = function(){
        window.wookmark = new Wookmark('#container ul', {
            itemWidth: 526, // Optional min width of a grid item
            offset: 10, // Optional the distance from grid to parent
            comparator: comparatorName
        });

        function comparatorName(a, b) {
            return parseInt($(a).data('itemid')) < $(b).data('itemid') ? -1 : 1;
        }
    }

    exports.updatePage = function(pageList, callback) {
        ReactDOM.render(React.createElement(PageContainer, { pageList: pageList }), document.getElementById('container'), callback);
    }

    exports.updateContentEditorFloat = function(data, callback) {
        ReactDOM.render(React.createElement(ContentEditorFloat, data), document.getElementById("editcontentFloatBody"), callback);
    }

    function parseUrl(url) {
        url = url ? url : "";
        var m = url.match(/(http|https):\/\/([^/]*)\/([^?#&]*)([^#]*)(.*)/);
        if(!m) return false;
        //校验链接合法性
        if(m[4]){
            if(m[4].indexOf("?") != 0)return false;
        }else{
            m[4] = "";
        }
        return {
            source: url,
            protocol: m[1],  //协议 http|https
            host: m[2],
            path: m[3],
            query: m[4],
            hash: m[5],
            params: (function(){
                var ret = {},
                    seg = m[4].replace(/^\?/,'').split('&'),
                    len = seg.length, i = 0, s;
                for (;i<len;i++) {
                    if (!seg[i]) { continue; }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })()
        };
    }

    function addUrlRd(link, rd) {
        console.log("addUrlRd");
        if(!link)return "";
        var url = parseUrl(link);
        if(!url || !url.protocol || !url.host)return link;
        var search = url.query;
        var m = /([?&])(ptag|PTAG)=([^&]*)/.exec(search)
        if(m){
            search = search.replace(m[1]+m[2]+"="+m[3], m[1]+m[2]+"="+rd);
        }else{
            if(rd){
                search += /\?/.test(search) ? "&ptag=" + rd : "?ptag=" + rd;
            }
        }
        return url.protocol + "://" + url.host + "/" +  url.path + search + url.hash;
    }
