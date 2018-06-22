<template>
    <div>
        <div class="container-fluid">
	 				<div class="form-group row">
 						<label class="col-sm-4 col-form-label">Loại phòng khám</label>
					    <div class="col-sm-8">
					    	<select class="form-control" id="clinic-type">
					    	<option value="1">Nha khoa</option><option value="2">Khoa nhi</option><option value="3">Răng Hàm Mặt</option><option value="4">Khoa mắt</option><option value="5">Tai - Mũi - Họng</option><option value="6">Tim mạch</option><option value="7">Nội tiết</option><option value="8">Xương khớp</option><option value="9">Tâm lý</option><option value="10">Vật lý trị liệu</option></select>
					    </div>
 					</div>
 					<div class="form-group row">
 						<label class="col-sm-4 col-form-label">Tên phòng khám</label>
					    <div class="col-sm-8">
					    	<select class="form-control" id="clinic-name">
					    		<option>ABC</option>
					    	</select>
					    </div>
 					</div>
 					<div class="form-group row">
 						<label class="col-sm-4 col-form-label">Lượt khám</label>
					    <div class="col-sm-8">
					    	<select class="form-control" id="clinic-shifts">
					    		<option>10:00 - 11:00</option>
					    		<option disabled="">10:00 - 11:00</option>
					    	</select>
					    </div>
 					</div>
 					<div class="form-group row">
 						<div class="col-sm-4">
 							<label class="col-form-label">Mô tả triệu chứng</label>
 							<small class="text-muted">Optional</small>
 						</div>
 						
					    <div class="col-sm-8">
					    	<textarea class="form-control"></textarea>
					    </div>
 					</div>
		 		</div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
