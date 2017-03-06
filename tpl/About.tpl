<div class="container text-center">
  <h1><strong>AJST</strong></h1>
  <p class="lead text-muted">- Asynchronous JavaScript Template -</p>
  <p>
    <button type="button" class="btn btn-primary" data-toggle="popover" data-placement="bottom" data-html="true" data-title="Download AJST" data-content="
      <ul class='nav'>
        <li><a target='_blank' href='<?=data.download?>'><i class='icon-download-alt'></i> Full source</a></li>
        <li><a target='_blank' href='<?=data.downloadjs?>'><i class='icon-download-alt'></i> AJST.js</a></li>
        <li><a target='_blank' href='<?=data.downloadmin?>'><i class='icon-download-alt'></i> AJST.min.js</a></li>
      </ul>
    "><i class="icon-cloud-download icon-5x"></i><br/>Download AJST</button>
    {{script}}
    $('[data-toggle="popover"]').popover();
    {{/script}}
  </p>
</div>

<div class="row">

  <div class="col-12 col-sm-5">
    <ul id="indexNavi" class="nav nav-pills nav-stacked index-navi"></ul>
  </div>

  <div class="container col-12 col-sm-7" id="IndexContainer"></div>

</div>
