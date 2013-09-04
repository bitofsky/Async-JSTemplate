<script id="indexMain">
<!-- navbar -->
<div class="navbar navbar-inverse navbar-fixed-top">
  <a class="navbar-brand" href="#" onclick="return false;">AJST</a>
  <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".nav-collapse">
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
  </button>
  <div class="nav-collapse collapse">
    <ul class="nav navbar-nav">
      <?includeEach('navbar.btn', data.navLeft)?>
    </ul>
    <ul class="nav navbar-nav pull-right">
      <?includeEach('navbar.btn', data.navRight)?>
    </ul>
  </div>
</div>
<!-- navbar -->

<!-- container -->
<div class="container"></div>
<!-- container -->
</script>

<script id="navbar.btn">
<li>
  <a class="visible-md" name="<?=data.name?>" href="<?=data.href?>"><?=data.text?></a>
  <a class="hidden-md" name="<?=data.name?>" href="<?=data.href?>"><?=data.icon ? sprintf('<i class="%s"></i> %s', data.icon, data.text) : data.text?></a>
</li>
</script>

<script id="index">

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

</script>
