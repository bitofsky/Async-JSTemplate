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
      <?includeEach('navbar.btn', data.buttonLeft)?>
    </ul>
    <ul class="nav navbar-nav pull-right">
      <?includeEach('navbar.btn', data.buttonRight)?>
    </ul>
  </div>
</div>
<!-- navbar -->

<!-- container -->
<div class="container"></div>
<!-- container -->
</script>

<script id="navbar.btn">
<li><a name="<?=data.name?>" href="<?=data.href?>"><?=data.icon ? sprintf('<i class="%s"></i> %s', data.icon, data.text) : data.text?></a></li>
</script>

<script id="index">
Index
</script>

<script id="unitTest">

  <div class="row">

    <div class="col-12 col-sm-4">
      <div class="affix-top">
        <ul class="nav nav-pills nav-stacked" id="TestList">
          <li class="nav-header">Test List</li>
        </ul>
      </div>
    </div>

    <div class="col-12 col-sm-8">
      <div class="accordion" id="Result">
      </div>
    </div>

  </div>

</script>