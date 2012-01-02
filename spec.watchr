watch 'spec/(.*)\.js' do
  puts `jasmine-node spec`
end

watch 'lib/(.*)\.js' do
  puts `jasmine-node spec`
end
